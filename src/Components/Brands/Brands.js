import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { createBrand, getBrands, getUsersByBrand } from '../../Services/brands';
import DatePicker from 'material-ui/DatePicker';


const dataSource = [
  {text: "Activo",value:"Activo"},
  {text:"Inactivo",value:"Inactivo"}
]
class Brands extends Component {

  state={
    open:false,
    open2:false,
    brand:{},
    cantidad:{},
    userss:[],
    newBrand:{},
    fecha:"",
    newObj:{},
    brands:[],
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
  }

// ESTE COMPONENTE SOLO LO VISUALIZAN LOS SUPERADMINS
// TRAE TODOS LOS BRANDS EXISTENTES
  componentWillMount(){
    getBrands()
     .then(brands=>{
    this.setState({brands})
     })
     .catch(e=>console.log(e))
   }

   // ABRE Y CIERRA DIALOGOS
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,newObj:{},newBrand:{}});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };
 
  // AGREGA INFORMACION AL NUEVO BRAND QUE SE ESTA CREANDO, EN SI AGREGA SI ESTA ACTIVO O INACTIVO
 onNewRequest = (chosenRequest) => {
  const {newBrand} = this.state;
  newBrand.activo =  chosenRequest.value;
  this.setState({newBrand});
}

// GUARDA LA INFO QUE SE ESTA ESCRIBIENDO PARA CREAR EL NUEVO BRAND
onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newBrand} = this.state;
  newBrand[field] = value;
  this.setState({newBrand}); 
}

// AGREGA LA FECHA DE CREACION DEL BRAND
handleChange = (event, date) => {
  const {newBrand} = this.state;
  let fecha = String(date);
  newBrand.fechaAlta = fecha.slice(0,24);
  this.setState({newBrand});
  const {newObj} = this.state;
  newObj.fecha = date;
  this.setState({newObj});
};

// MUESTRA EL DETALLE DE BRAND EN SI MUESTRA LOS USUARIOS QUE TIENE UN BRAND Y SU PUESTO Y SU CORREO
brandDetail = (brand) =>{
  getUsersByBrand(brand._id)
  .then(users=>{
    this.handleOpen2();
    this.setState({userss:users,cantidad:users.length,brand:brand})
  })
  .catch(e=>{
    console.log(e)
  })
}

// FUNCION PARA CREAR UN NUEVO BRAND Y MANDAR LA INFO A NUESTRO BACKEND MEDIANTE EL SERVICIO 
// createBrand QUE HACE LA CONEXION CON NUESTRO BACKEND
sendBrand = (e) => {
  createBrand(this.state.newBrand)
  .then(brand=>{
    this.handleClose();
  })
  .catch(e=>console.log(e))
};

  render() {
    const {brand,cantidad,userss} = this.state;
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
      onClick={this.sendBrand}  
      label="Crear Brand" 
      backgroundColor="#0D47A1"
      labelColor="#FAFAFA"  
      />
    ]
    return (
    <div>
       <Dash/>
       <br/><br/><br/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="CREA UN BRAND"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons">work</FontIcon>}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
            className="crearDinamicaResponsive"
          /> 
         </div>
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
                Brands Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn >Brand</TableHeaderColumn>
              <TableHeaderColumn >Condición</TableHeaderColumn>
              <TableHeaderColumn >Fecha Alta</TableHeaderColumn>
              <TableHeaderColumn >Detalles</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.brands.sort((a, b) => a.nombre !== b.nombre ? a.nombre < b.nombre ? -1 : 1 : 0)
.map( (brand, index) => (
              <TableRow key={brand._id} data={brand}>
                <TableRowColumn>{brand.nombre}</TableRowColumn>
                <TableRowColumn>{brand.activo}</TableRowColumn>
                <TableRowColumn>{brand.fechaAlta}</TableRowColumn>
                <TableRowColumn><button className="buttonDinamicasDetalle" onClick={() => this.brandDetail(brand)}>Ver Usuarios</button></TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
          <Dialog
            title="Crea un Brand"
            modal={false}
            actions={actions2}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
                     
            <TextField onChange={this.onChange} name="nombre" hintText="Nombre del Brand" type="text"  underlineShow={false} />
            <Divider />
            <AutoComplete
            floatingLabelText="Activo/Inactivo"
            filter={AutoComplete.noFilter}
            openOnFocus={true}
            dataSourceConfig={ {text: 'text', value: 'value'}  }
            dataSource={dataSource}
            onNewRequest={this.onNewRequest}
          />            
          <Divider />
          <DatePicker
            hintText="Fecha de Alta"
            value={this.state.newObj.fecha}
            onChange={this.handleChange}
            autoOk={true}
            container="inline"
          />
        </Dialog> 
         </div>
         <div>
          <Dialog
            title={"Usuarios de "+brand.nombre}
            modal={false}
            actions={actions}
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
              <TableHeaderColumn >Puesto</TableHeaderColumn>
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
                <TableRowColumn>{user.nombre && user.apellido ? user.nombre + " " + user.apellido : "Sin nombre"}</TableRowColumn>
                <TableRowColumn>{user.correo}</TableRowColumn>
                <TableRowColumn>{user.puesto}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>          
        </Dialog> 
         </div>
    </div>
    );
  }
}

export default Brands;