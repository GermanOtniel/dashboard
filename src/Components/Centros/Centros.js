import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
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
import './centros.css';

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
    showCheckboxes: true,
    height: '300px',
  }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
 
componentWillMount(){
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
     this.setState({centrosFilter:centros,centros})
   })
   .catch(e=>console.log(e))
 }
 onNewRequest = (chosenRequest) => {
  const {newCenter} = this.state;
  newCenter.zona =  chosenRequest;
  this.setState({newCenter});
}
onNewRequest2 = (chosenRequest) => {
  const {newCenter} = this.state;
  newCenter.activo =  chosenRequest.value;
  this.setState({newCenter});
}

onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newCenter} = this.state;
  newCenter[field] = value;
  console.log(newCenter)
  this.setState({newCenter}); 
}

filterList = (e) =>{
  var updatedList = this.state.centros.map(dinamic=>dinamic);
  updatedList = updatedList.map(dinamic=>dinamic).filter(function(item){
    return item.nombre.toLowerCase().search(
      e.target.value.toLowerCase()) !== -1 || item.zona.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1 || item.nombre.toLowerCase().search(
          e.target.value.toLowerCase()) !== -1 || item.created.toLowerCase().search(
            e.target.value.toLowerCase()) !== -1 ;
  });
  this.setState({centrosFilter: updatedList})
}

sendCenter = (e) => {
  createCenter(this.state.newCenter)
  .then(centro=>{
    this.handleClose();
    this.componentWillMount();
  })
  .catch(e=>console.log(e))
}


  render() {
    
    return (
    <div>
       <Dash/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="CREA UN CENTRO DE CONSUMO"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons" >store_mall_directory</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
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
                Centros de Consumo
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn >Centro</TableHeaderColumn>
              <TableHeaderColumn >Fecha de Creación</TableHeaderColumn>
              <TableHeaderColumn >Zona</TableHeaderColumn>
              <TableHeaderColumn >Editar</TableHeaderColumn>

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
                <TableRowColumn>Editar</TableRowColumn>
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
    
          <RaisedButton 
          onClick={this.sendCenter}  
          label="Crear Centro" 
          backgroundColor="#0D47A1"
          labelColor="#FAFAFA" 
          />
          
        </Dialog> 
         </div>
         
    </div>
    );
  }
}

export default Centros;