import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {green700,blue500} from 'material-ui/styles/colors';
import { getZonas, createCenter, getCenters } from '../../Services/pez';
import { getUsersByCenter } from '../../Services/centro';
import { getUsersByDinamics } from '../../Services/dinamicas';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  }
};
const dataSource2 = [
  {text: "Activo",value:"Activo"},
  {text:"Inactivo",value:"Inactivo"}
]

class Centros extends Component {

  state={
    open:false,
    open2:false,
    newCenter:{},
    centros:[],
    centrosFilter:[],
    newZone:{},
    zonas:[],
    iniciaStateDeTabla: "_REPITO INICIA STATE DE TABLA_",
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: true,
    showRowHover: true,
    selectable: true,
    multiSelectable: false,
    enableSelectAll: true,
    deselectOnClickaway: true,
    showCheckboxes: false,
    height: '300px',
    userss:[],
    cantidad:0,
    centro:{},
    superadmin:false,
    open3:false,
    cuantos:0
  }
 //ESTE COMPONENTE SOLO LO VISUALIZAN LOS SUPERADMINS
 //TRAE TODAS LAS ZONAS
 //TRAE TODOS LOS CENTROS DE CONSUMO
componentWillMount(){
  let puestoUser = `${JSON.parse(localStorage.getItem('user')).puesto}`
  let brandUser = `${JSON.parse(localStorage.getItem('user')).brand}`
  if(puestoUser === "SUPERADMIN"){
    getZonas()
    .then(zonas=>{
     this.setState({zonas})
    })
    .catch(e=>alert(e))
    getCenters()
    .then(centros=>{
     var centross =  centros.map(centro=> centro.zona.nombre);
     for(let i= 0; i < centros.length;i++) 
       {
         centros[i].zona = centross[i]
         centros[i].created = centros[i].created_at.slice(0,10)
       }
      this.setState({centrosFilter:centros,centros,superadmin:true,cuantos:centros.length})
    })
    .catch(e=>console.log(e))
  }
  else{
    getUsersByDinamics(brandUser)
    .then(centros=>{
      var centross =  centros.map(centro=> centro.zona.nombre);
      for(let i= 0; i < centros.length;i++) 
        {
          centros[i].zona = centross[i]
          centros[i].created = centros[i].created_at.slice(0,10)
        }
       this.setState({centrosFilter:centros,centros,superadmin:false,cuantos:centros.length})
    })
    .catch(e=>console.log(e))
  }
 }

 // ABRIR Y CERRAR DIALOGOS
handleOpen = () => {
  this.setState({open: true});
};
handleClose = () => {
  this.setState({open: false});
};
handleOpen2 = () => {
  this.setState({open2: true});
};
handleClose2 = () => {
  this.setState({open2: false});
};
handleOpen3 = () => {
  this.setState({open3: true});
};
handleClose3 = () => {
  this.setState({open3: false});
};

// AGREGA LA ZONA ELEGIDA AL CENTRO DE CONSUMO QUE SE VA A CREAR
onNewRequest = (chosenRequest) => {
  const {newCenter} = this.state;
  newCenter.zona =  chosenRequest;
  this.setState({newCenter});
}

// AGREGA EL STATUS ("ACTIVO" O "INACTIVO") AL CENTRO DE CONSUMO QUE SE ESTA CREANDO
onNewRequest2 = (chosenRequest) => {
  const {newCenter} = this.state;
  newCenter.activo =  chosenRequest.value;
  this.setState({newCenter});
}

// GUARDA LA INFO QUE SE ESTA AGREGANDO AL CENTRO DE CONSUMO QUE ESTAMOS CREANDO
onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newCenter} = this.state;
  newCenter[field] = value;
  this.setState({newCenter}); 
}

// FUNCION QUE AYUDA A FILTRAR CENTROS DE CONSUMO POR NOMBRE, ZONA Y FECHA DE CREACIÓN
filterList = (e) =>{
  var updatedList = this.state.centros.map(dinamic=>dinamic);
  updatedList = updatedList.map(dinamic=>dinamic).filter(function(item){
    return item.nombre.toLowerCase().search(
      e.target.value.toLowerCase()) !== -1 || item.zona.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1 || item.created.toLowerCase().search(
            e.target.value.toLowerCase()) !== -1 ;
  });
  this.setState({centrosFilter: updatedList})
}

// SE MUESTRAN LOS USUARIOS CON LOS QUE CUENTA UN CENTRO DE CONSUMO  
centro = (centro) =>{
  getUsersByCenter(centro._id)
  .then(users=>{
    this.handleOpen2()
    this.setState({userss:users,cantidad:users.length,centro:centro})
  })
  .catch(e=>console.log(e))
}

// AQUI SE ENVIA EL CENTRO DE CONSUMO QUE SE ESTA CREANDO, USAMOS EL SERVICIO 
// createCenter QUE CONECTA CON EL BACKEND PARA PROCESAR Y CREAR EL CENTRO DE CONSUMO ESPECIFICADO
sendCenter = (e) => {
  createCenter(this.state.newCenter)
  .then(centro=>{
    this.handleClose();
    this.componentWillMount();
  })
  .catch(e=>console.log(e))
}

// CLICK A LOS DETALLES DE UN USUARIO
goToUser = (user) =>{
  this.props.history.push(`/user/${user._id}`)
}

  render() {
    const {userss,cantidad,centro,superadmin,cuantos} = this.state;
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose2}
      />,
    ];
    const actions2 = [
        <RaisedButton 
          onClick={this.sendCenter}  
          label="Crear Centro" 
          backgroundColor="#0D47A1"
          labelColor="#FAFAFA" 
        />
    ];
    const actions3 = [
      <FlatButton 
        onClick={this.handleClose3}  
        label="Ok" 
        primary={true}
        />
  ]
    return (
    <div>
       <Dash/>
       <br/><br/><br/>
       <div className="zona-container">
         <div style={superadmin ? {color:'white'} : {display:'none'}}>
          <RaisedButton
            label="CREAR CENTRO"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons" >store_mall_directory</FontIcon>}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
            className="crearDinamicaResponsive"
          /> 
         </div>
         <div style={!superadmin ? {color:'white'} : {display:'none'}}>
          <RaisedButton
            label="CENTROS"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons" >store_mall_directory</FontIcon>}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen3}
            className="crearDinamicaResponsive"
          /> 
         </div>
       </div>
       <div className="buscadorCentros">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Por nombre, fecha ó zona" type="text" onChange={this.filterList}/>
      </div>
       <div>
       <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn colSpan="4" tooltip="Super Header" style={{textAlign: 'center'}}>
                {cuantos + " "}Centros de Consumo
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn >Centro</TableHeaderColumn>
              <TableHeaderColumn >Fecha de Creación</TableHeaderColumn>
              <TableHeaderColumn >Zona</TableHeaderColumn>
              <TableHeaderColumn >Ver</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.centrosFilter.sort((a, b) => a.nombre !== b.nombre ? a.nombre < b.nombre ? -1 : 1 : 0)
.map( (centro, index) => (
              <TableRow key={centro._id} data={centro}>
                <TableRowColumn>{centro.nombre}</TableRowColumn>
                <TableRowColumn>{centro.created}</TableRowColumn>
                <TableRowColumn>{centro.zona}</TableRowColumn>
                <TableRowColumn><button onClick={() => this.centro(centro)} className="buttonDinamicasDetalle">Ver Centro</button></TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
          <Dialog
            title="Crea un Centro de Consumo"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
            actions={actions2}
          >
          
          <AutoComplete
            floatingLabelText="Selecciona la Zona"
            filter={AutoComplete.caseInsensitiveFilter}
            openOnFocus={true}
            dataSource={this.state.zonas.map(zona => zona)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest}
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />  
          <Divider/>
          <AutoComplete
            floatingLabelText="Estatus"
            filter={AutoComplete.noFilter}
            openOnFocus={true}
            dataSourceConfig={ {text: 'text', value: 'value'}  }
            dataSource={dataSource2}
            onNewRequest={this.onNewRequest2}
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />
          <Divider />
          <TextField
            hintText="Ej. La Cervecería Polanco"
            floatingLabelText="Nombre del Centro de Consumo (Sea específico)"
            fullWidth={true}
            onChange={this.onChange}
            name="nombre"
            type="text"
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />                     
          <Divider />
          <TextField
            hintText="Solo números"
            floatingLabelText="Código Postal"
            onChange={this.onChange}
            name="codigoPostal"
            type="number"
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />                     
          <Divider />
          
        </Dialog> 
         </div>
         <div>
          <Dialog
          title={"Usuarios de " + centro.nombre}
          actions={actions}
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
          autoScrollBodyContent={true}
        >
        <b>{cantidad + " usuarios en Total"}</b>
        <div>
       <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Super Header" style={{textAlign: 'center'}}>
                Usuarios por Centro de Consumo
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn >Nombre</TableHeaderColumn>
              <TableHeaderColumn >Correo</TableHeaderColumn>
              <TableHeaderColumn >Más</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {userss.sort((a, b) => a.correo !== b.correo ? a.correo < b.correo ? -1 : 1 : 0)
.map( (user, index) => (
              <TableRow key={user._id} data={user}>
                <TableRowColumn>{user.nombre + " " + user.apellido}</TableRowColumn>
                <TableRowColumn>{user.correo}</TableRowColumn>
                <TableRowColumn>
                  <div>
                    <IconMenu
                      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                      targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    >
                      <MenuItem onClick={()=>this.goToUser(user)} primaryText="Ver Usuario" />
                    </IconMenu>
                  </div>
  </TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
        </Dialog>
          </div>
          <div>
          <Dialog
            title="Información"
            modal={false}
            open={this.state.open3}
            onRequestClose={this.handleClose3}
            autoScrollBodyContent={true}
            actions={actions3}
          >
            Aquí podrás observar los Centros de Consumo en donde tienes dinámicas activas y los usuarios que están inscritos en los respectivos Centros de Consumo.
        </Dialog> 
         </div>
    </div>
    );
  }
}

export default Centros;