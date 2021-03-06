import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import {green700,blue500} from 'material-ui/styles/colors';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { getCountry, createState, getStates, createZone, getZonas } from '../../Services/pez';

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

class Zonas extends Component {

  state={
    open:false,
    open2:false,
    country:[],
    newState:{},
    estados:[],
    newZone:{},
    zonas:[],
    zonasFilter:[],
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

// ESTE COMPONENTE SOLO LO VISUALIZAN LOS SUPERADMINS O LOS DEL BRAND DE 1PUNTOCINCO
// ASI QUE USAMOS EL SERVCIO QUE TRAIGA TODA SLAS ZONAS EXISTENTES, TODOS LOS ESTADOS EXISTENTES Y EL PAIS EXISTENTE
  componentWillMount(){
  getZonas()
   .then(zonas=>{
  var zonass =  zonas.map(zona=> zona.estado.nombre);
  for(let i= 0; i < zonas.length;i++) 
    {
      zonas[i].estado = zonass[i]
      zonas[i].created = zonas[i].created_at.slice(0,10)
    }
     this.setState({zonasFilter:zonas,zonas})
   })
   .catch(e=>alert(e))
  getCountry()
   .then(country=>{
     this.setState({country})
   })
   .catch(e=>alert(e))
   getStates()
   .then(estados=>{
     this.setState({estados})
   })
   .catch(e=>alert(e))
 }

// SE USAN PARA ABRIR LOS DIALOGOS PARA CREAR ESTADOS O ZONAS
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

// SE USA PARA HACER BUSQUEDA DE ZONAS POR NOMBRE, ESTADO Y FECHA DE CREACION
 filterList = (e) =>{
  var updatedList = this.state.zonas.map(dinamic=>dinamic);
  updatedList = updatedList.map(zona=>zona).filter(function(item){
    return item.nombre.toLowerCase().search(
      e.target.value.toLowerCase()) !== -1 || item.estado.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1  || item.created.toLowerCase().search(
          e.target.value.toLowerCase()) !== -1 ;
  });
  this.setState({zonasFilter: updatedList})
 }

 // SE USA PARA INSERTAR EL PAIS AL NUEVO ESTADO QUE ESTAMOS CREANDO
 onNewRequest = (chosenRequest) => {
  const {newState} = this.state;
  newState.pais =  chosenRequest;
  this.setState({newState});
 }

 // SE USA PARA INSERTAR EL ESTADO AL QUE PERTENECERA LA ZONA QUE ESTAMOS CREANDO
 onNewRequest2 = (chosenRequest) => {
  const {newZone} = this.state;
  newZone.estado =  chosenRequest;
  this.setState({newZone});
 }

 // SE USA PARA GUARDAR LA INFO CON LA QUE SE CREARA EL NUEVO ESTADO
 onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newState} = this.state;
  newState[field] = value;
  this.setState({newState}); 
 }

 // SE USA PARA GUARDAR LA INFO DE LA NUEVA ZONA QUE SE CREARA
 onChange2 = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newZone} = this.state;
  newZone[field] = value;
  this.setState({newZone}); 
 }

 // SE ENVIA EL ESTADO A NUESTRO BACKEND PARA SU CREACION SE USA EL SERVICIO createState
  sendEdit = (e) => {
    const estado = this.state.newState;
    createState(estado)
    .then(state=>{
      this.componentWillMount();
      this.setState({open:false})

    })
    .catch(e=>console.log(e))
  }

   // SE ENVIA LA ZONA A NUESTRO BACKEND PARA SU CREACION SE USA EL SERVICIO createZone
  sendZona = (e) => {
    const zona = this.state.newZone;
    createZone(zona)
    .then(zona=>{
      this.componentWillMount();
      this.setState({open2:false})

    })
    .catch(e=>console.log(e))
  }

  render() {
    const actions = [
      <RaisedButton 
      onClick={this.sendEdit}  
      label="Crear Estado" 
      backgroundColor="#0D47A1"
      labelColor="#FAFAFA"  
      />
    ];
    const actions2 = [
      <RaisedButton 
      onClick={this.sendZona}  
      label="Crear Zona" 
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
            label="CREAR ESTADO"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons" >map</FontIcon>}
            //style={styles.button}
            labelStyle={{fontSize:'12px'}}
            onClick={this.handleOpen}
            className="crearZonaYEstadoResponsive"
          /> 
         </div>
         <div>
          <RaisedButton
            label="CREAR ZONA"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons" >place</FontIcon>}
            //style={styles.button}
            labelStyle={{fontSize:'12px'}}
            onClick={this.handleOpen2}
            className="crearZonaYEstadoResponsive"
          />
         </div>
       </div>
       <div className="buscador">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Busca una Zona" type="text" onChange={this.filterList}/>
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
                Zonas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The Name">Zona</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Creación</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Estado</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Editar</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.zonasFilter.sort((a, b) => a.nombre !== b.nombre ? a.nombre < b.nombre ? -1 : 1 : 0)
.map( (zona, index) => (
              <TableRow key={zona._id} data={zona}>
                <TableRowColumn>{zona.nombre}</TableRowColumn>
                <TableRowColumn>{zona.created}</TableRowColumn>
                <TableRowColumn>{zona.estado}</TableRowColumn>
                <TableRowColumn>Editar</TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
          <Dialog
            title="Crea un Estado"
            modal={false}
            open={this.state.open}
            autoScrollBodyContent={true}
            actions={actions}
            onRequestClose={this.handleClose}
          >
          <AutoComplete
            floatingLabelText="Selecciona el País"
            filter={AutoComplete.caseInsensitiveFilter}
            openOnFocus={true}
            dataSource={this.state.country.map(country => country)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest}
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />            
          <Divider />
            <TextField 
            onChange={this.onChange} 
            name="nombre" 
            floatingLabelText="Nombre del Estado"
            hintText="Cuida la ortografía" 
            type="text"  
            underlineShow={true} 
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
            title="Crea una Zona"
            modal={false}
            open={this.state.open2}
            autoScrollBodyContent={true}
            actions={actions2}
            onRequestClose={this.handleClose2}
          >
          
          <AutoComplete
            floatingLabelText="Selecciona el Estado"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.estados.map(state => state)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest2}
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
            openOnFocus={true}
          />            
          <Divider />
            <TextField 
            onChange={this.onChange2} 
            name="nombre" 
            floatingLabelText="Nombre de la Zona"
            hintText="Cuida la ortografía" 
            type="text"  
            underlineShow={true} 
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
            />
            <Divider />
          
        </Dialog> 
         </div>
    </div>
    );
  }
}

export default Zonas;