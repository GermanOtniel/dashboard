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
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { getZonas, getCenters } from '../../Services/pez';
import { getUser } from '../../Services/authDash';
import { zoneById } from '../../Services/dinamicas';
import { getSingleBrand } from '../../Services/brands';
import FlatButton from 'material-ui/FlatButton';
import './dinamicas.css';

const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  },
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  }
};

const dataSource2 = [
  {text: "Activo",value:"Activo"},
  {text:"Inactivo",value:"Inactivo"}
]

class Dinamicas extends Component {

  state={
    zone:{},
    zona:{},
    open:false,
    open2:false,
    newZone:{},
    centros:[],
    centros2:[],
    newZone:{},
    zonas:[],
    brandId:{},
    brand:{},
    marcas:[],
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
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };
  componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getUser(id)
    .then(user=>{
      let {brandId} = this.state;
      brandId = user.brand;
      this.setState({brandId})
      getSingleBrand(this.state.brandId._id)
      .then(brand=>{
        let {marcas} = this.state;
        marcas = brand.marcas
        this.setState({marcas})
        console.log(this.state.marcas)
      })
      .catch(e=>console.log(e))
    })
    .catch(e=>console.log(e))
    getZonas()
     .then(zonas=>{
      this.setState({zonas})
     })
     .catch(e=>alert(e))
   }
   onNewRequest2 = (chosenRequest) => {
     //console.log(chosenRequest.centros.map(centro => centro))
    const {newZone} = this.state;
    newZone._id =  chosenRequest._id;
    newZone.nombre =  chosenRequest.nombre;
    let {centros} = this.state;
    centros = chosenRequest.centros.map(centro => centro)
    this.setState({newZone});
    console.log('NEW ZONA',this.state.newZone,'CENTROS',this.state.centros);
  }
  /*-------------------    getCenters()
     .then(centros=>{
      var centross =  centros.map(centro=> centro.zona.nombre);
      for(let i= 0; i < centros.length;i++) 
        {
          centros[i].zona = centross[i]
        }
       this.setState({centros})
     })
     .catch(e=>console.log(e))--------------------------*/

  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
 
 

 onNewRequest = (chosenRequest) => {
  const {newCenter} = this.state;
  newCenter.zona =  chosenRequest;
  this.setState({newCenter});
}


onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newCenter} = this.state;
  newCenter[field] = value;
  this.setState({newCenter}); 
  console.log(newCenter)
}

getZone = (e) => {
  zoneById(this.state.zone._id)
  .then(zona=>{
    this.handleClose();
    this.setState({zona})
    console.log(this.state.zona)
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
            label="Seleccionar Zona para tu Dinámica"
            labelPosition="before"
            primary={true}
            icon={<FontIcon className="material-icons" >store_mall_directory</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen2}
          /> 
         </div>
         <div>
          <RaisedButton
            label="CREA UNA DINAMICA"
            labelPosition="before"
            primary={true}
            icon={<FontIcon className="material-icons" >store_mall_directory</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
          /> 
         </div>
       </div>
       {/*
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
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Dinámica</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Modalidad</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Zona</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Estatus</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Fecha Inicio</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Fecha Fin</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.centros.sort((a, b) => a.nombre !== b.nombre ? a.nombre < b.nombre ? -1 : 1 : 0)
.map( (centro, index) => (
              <TableRow key={centro._id} data={centro}>
                <TableRowColumn>{centro._id}</TableRowColumn>
                <TableRowColumn>{centro.nombre}</TableRowColumn>
                <TableRowColumn>{centro.zona}</TableRowColumn>
                <TableRowColumn>Editar</TableRowColumn>
                <TableRowColumn>Editar</TableRowColumn>
                <TableRowColumn>Editar</TableRowColumn>
                <TableRowColumn>Editar</TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
            */}
       <div>
          <Dialog
            title="Crea una Dinámica"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
          <Paper  zDepth={2}>
          <AutoComplete
            floatingLabelText="Selecciona Marca(s)"
            filter={AutoComplete.caseInsensitiveFilter}
            multiLine={true}
            rows={2}
            dataSource={this.state.marcas.map(marca => marca)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest}
          />  
          <Divider/>
          <AutoComplete
            floatingLabelText="showAllItems"
            filter={AutoComplete.noFilter}
            openOnFocus={true}
            dataSourceConfig={ {text: 'text', value: 'value'}  }
            dataSource={dataSource2}
            onNewRequest={this.onNewRequest2}
          />
          <Divider />
          <TextField
            hintText="Sea específico en pocas palabras"
            floatingLabelText="Nombre de la Dinámica"
            multiLine={true}
            rows={2}
            onChange={this.onChange}
            name="nombre"
            type="text"
          />
          <Divider />
          <TextField
            floatingLabelText="Descripción de la Dinámica"
            multiLine={true}
            rows={2}
            onChange={this.onChange}
            name="nombre"
            type="text"
          />                     
          <Divider />
          <FlatButton
            label="Choose an Image"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
          > 
            <input type="file" style={styles.uploadInput} />
          </FlatButton>
    </Paper>
          <RaisedButton onClick={this.sendCenter}  label="Crear Centro" secondary={true}  />
          
        </Dialog> 
         </div>
         <div>
          <Dialog
            title="Selecciona la Zona"
            modal={false}
            open={this.state.open2}
            onRequestClose={this.handleClose2}
          >
          <Paper  zDepth={2}>
          <AutoComplete
            floatingLabelText="Selecciona la Zona"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.zonas.map(zona => zona)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest2}
          />                                
          <Divider />
    </Paper>
          <RaisedButton onClick={this.ge}  label="Enviar" secondary={true}  />
          
        </Dialog> 
         </div>
         
    </div>
    );
  }
}

export default Dinamicas;