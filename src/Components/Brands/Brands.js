import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { createBrand, getBrands } from '../../Services/brands';
import DatePicker from 'material-ui/DatePicker';
import './brands.css';

const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  }
};
const dataSource = [
  {text: "Activo",value:"Activo"},
  {text:"Inactivo",value:"Inactivo"}
]
class Brands extends Component {

  state={
    open:false,
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
    showCheckboxes: true,
    height: '300px',
  }

  componentWillMount(){
    getBrands()
     .then(brands=>{
    this.setState({brands})
     })
     .catch(e=>console.log(e))
   }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
 
 onNewRequest = (chosenRequest) => {
  const {newBrand} = this.state;
  newBrand.activo =  chosenRequest.value;
  this.setState({newBrand});
}
onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newBrand} = this.state;
  newBrand[field] = value;
  console.log(newBrand)
  this.setState({newBrand}); 
}
handleChange = (event, date) => {
  const {newBrand} = this.state;
  let fecha = String(date);
  newBrand.fechaAlta = fecha.slice(0,24);
  this.setState({newBrand});
  const {newObj} = this.state;
  newObj.fecha = date;
  this.setState({newObj});
};
sendBrand = (e) => {
  createBrand(this.state.newBrand)
  .then(brand=>{
    this.handleClose();
    console.log(brand)
  })
  .catch(e=>console.log(e))
  console.log(this.state.newBrand);
};


  render() {
    
    return (
    <div>
       <Dash/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="CREA UN BRAND"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons">work</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
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
              <TableHeaderColumn colSpan="5" tooltip="Super Header" style={{textAlign: 'center'}}>
                Brands Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Brand</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Condición</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Fecha Alta</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Editar</TableHeaderColumn>

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
                <TableRowColumn>{brand._id}</TableRowColumn>
                <TableRowColumn>{brand.nombre}</TableRowColumn>
                <TableRowColumn>{brand.activo}</TableRowColumn>
                <TableRowColumn>{brand.fechaAlta}</TableRowColumn>
                <TableRowColumn>Editar</TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
          <Dialog
            title="Crea un Brand"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
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
          />
          <RaisedButton 
          onClick={this.sendBrand}  
          label="Crear Brand" 
          backgroundColor="#0D47A1"
          labelColor="#FAFAFA"  
          />
          
        </Dialog> 
         </div>
    </div>
    );
  }
}

export default Brands;