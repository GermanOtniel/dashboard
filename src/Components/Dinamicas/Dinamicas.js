import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { getZonas} from '../../Services/pez';
import { createDinamic, getDinamics } from '../../Services/dinamicas';
import { getUser } from '../../Services/authDash';
import DatePicker from 'material-ui/DatePicker';
import { getBrand } from '../../Services/brands';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import firebase from '../../firebase/firebase';
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
const styles2 = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const dataSource2 = [
  {text: "Activa",value:"Activa"},
  {text:"Inactiva",value:"Inactiva"}
]

class Dinamicas extends Component {

  state={
    open:false,
    centros:[],
    zonas:[],
    marcas:[],
    newDinamic:{},
    dinamics:[],
    newObj:{},
    newObj2:{},
    textFieldDisabled:true,
    textFieldDisabled2:true,
    chipData: [],
    chipData2:[],
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
    height: '300px'
  }
  handleRequestDelete = (label) => {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(label);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
  };
  handleRequestDelete2 = (label) => {
    this.chipData = this.state.chipData2;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(label);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData2: this.chipData});
  };
  componentWillMount(){
    //ID DEL BRAND
    const id = `${JSON.parse(localStorage.getItem('user')).brand}`;
    //TRAEMOS EL BRAND PARA POPULAR SUS MARCAS Y TENER LAS MARCAS PARA EL AUTOCOMPLETE DE MARCAS
    getBrand(id)
      .then(brand=>{
        //console.log(brand)
        let {marcas} = this.state;
        marcas = brand.marcas
        this.setState({marcas})
      })
      .catch(e=>console.log(e))
    //TRAEMOS LAS ZONAS PARA TENER LAS ZONAS PARA EL AUTOCOMPLETE DE ZONAS
    getZonas()
     .then(zonas=>{
      this.setState({zonas})
     })
     .catch(e=>console.log(e))
     //ESTE ES EL SERVICIO PARA TRAER LAS DINAMICAS QUE EXISTEN Y REPRESENTARLAS EN LA TABLA
    getDinamics()
     .then(dinamics=>{
       //console.log(dinamics.map(dinamic => dinamic));
       let brands = dinamics.map(dinamic => dinamic.brand.nombre);
       for(let i= 0; i < dinamics.length;i++) 
        {
          dinamics[i].brand = brands[i]
        }
       this.setState({dinamics})
     })
     .catch(e=>console.log(e))
   }


  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({newDinamic:{}, open: false,newObj:{},newObj2:{},chipData:[],chipData2:[]});
  };
  handleClose3 = () => {
    this.setState({textFieldDisabled: true,textFieldDisabled2:false});
  };
  handleOpen3 = () => {
    this.setState({textFieldDisabled: false,textFieldDisabled2:true});
  };
 

 onNewRequestMarca = (chosenRequest) => {
    let { chipData } = this.state;
    let { newDinamic } = this.state;
    chipData.push(chosenRequest);
    newDinamic.marcas = chipData;
    this.setState({chipData,newDinamic})
}
onNewRequestCentro = (chosenRequest) => {
  let { chipData2 } = this.state;
  let { newDinamic } = this.state;
  chipData2.push(chosenRequest)
  newDinamic.centroConsumo = chipData2;
  this.setState({chipData2,newDinamic})
}
onNewRequest2 = (chosenRequest) => {
  let {newDinamic} = this.state;
  newDinamic.activa = chosenRequest.value;
}
onNewRequestZona = (chosenRequest) => {
  let {centros} = this.state;
  centros = chosenRequest.centros
  this.setState({centros});
}

handleChange = (event, date) => {
  console.log(date)
  let {newDinamic} = this.state;
  let fecha = String(date);
  newDinamic.fechaInicio = fecha.slice(4,15);
  this.setState({newDinamic});
  const {newObj} = this.state;
  newObj.fecha = date;
  this.setState({newObj});
};
handleChange2 = (event, date) => {
  let {newDinamic} = this.state;
  let fecha = String(date);
  newDinamic.fechaFin = fecha.slice(4,15);
  this.setState({newDinamic});
  const {newObj2} = this.state;
  newObj2.fecha = date;
  this.setState({newObj2});
};
onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newDinamic} = this.state;
  newDinamic[field] = value;
  this.setState({newDinamic}); 
}
getFile = e => {
  const file = e.target.files[0];
  const brand = `${JSON.parse(localStorage.getItem('user'))._id}`;
  const date = new Date();
  const date2 = String(date).slice(15,24)
  //aqui lo declaro
  const uploadTask = firebase.storage()
  .ref("dinamicas")
  .child(brand + date2 + file.name)
  .put(file);
  //aqui agreggo el exito y el error
  uploadTask
  .then(r=>{
    console.log(r.downloadURL)
    const {newDinamic} = this.state;
    newDinamic.imagenPremio =  r.downloadURL;
    this.setState({newDinamic})
    console.log(this.state.newDinamic.imagenPremio)
  })
  .catch(e=>console.log(e)) //task
  //aqui reviso el progreso
  // uploadTask.on('state_changed', (snap)=>{
  //   const total = (snap.bytesTransferred / snap.totalBytes) * 100;
  //   this.setState({total});
  // })
};
sendDinamic = (e) => {
  const { newDinamic } = this.state;
  newDinamic.brand = `${JSON.parse(localStorage.getItem('user')).brand}`;
  createDinamic(newDinamic)
  .then(dinamic=>{
    //console.log(dinamic)
    this.handleClose();
  })
  .catch(e=>console.log(e))
}
renderChip(data) {
  return (
    <Chip
      key={data._id}
      onRequestDelete={() => this.handleRequestDelete(data._id)}
      style={styles2.chip}
    >
      {data.nombre}
    </Chip>
  );
}
renderChip2(data) {
  return (
    <Chip
      key={data._id}
      onRequestDelete={() => this.handleRequestDelete2(data._id)}
      style={styles2.chip}
    >
      {data.nombre}
    </Chip>
  );
}
  render() {
    
    return (
    <div>
       <Dash/>
       <div className="zona-container">
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
       <div>
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
              <TableHeaderColumn colSpan="7" style={{textAlign: 'center'}}>
                Marcas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn>Modalidad</TableHeaderColumn>
              <TableHeaderColumn>BRAND</TableHeaderColumn>
              <TableHeaderColumn>Nombre</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Fecha de Inicio</TableHeaderColumn>
              <TableHeaderColumn>Fecha de Término</TableHeaderColumn>
              <TableHeaderColumn>Ver</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.dinamics.sort((a, b) => a.modalidad !== b.modalidad ? a.modalidad < b.modalidad ? -1 : 1 : 0)
.map( (dinamic, index) => (
              <TableRow key={dinamic._id} data={dinamic}>
                <TableRowColumn>{dinamic.modalidad}</TableRowColumn>
                <TableRowColumn>{dinamic.brand}</TableRowColumn>
                <TableRowColumn>{dinamic.nombreDinamica}</TableRowColumn>
                <TableRowColumn>{dinamic.status}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaInicio}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaFin}</TableRowColumn>
                <TableRowColumn>Ver Detalle</TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       </div>
       <div >
          <Dialog
            title="Crea una Dinámica"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
          <RadioButtonGroup onChange={this.onChange} name="modalidad" >
          <RadioButton 
          value="Ventas"
          label="Ventas"
          onClick={this.handleClose3}
          />
          <RadioButton 
          value="Puntos"
          label="Puntos"
          onClick={this.handleOpen3}
          />
          </RadioButtonGroup>
          <div className="padre">
          <div className="margin">
          <TextField
            hintText="Meta = Unidades por vender"
            floatingLabelText="Meta a vender"
            name="meta"
            type="number"
            onChange={this.onChange}
            disabled={this.state.textFieldDisabled2}
          />
          <TextField
            hintText="Recuerde unidad = 1 copa"
            floatingLabelText="Puntos por unidad"
            name="puntos"
            type="number"
            onChange={this.onChange}
            disabled={this.state.textFieldDisabled}
          />
          </div>
          </div>
          <TextField
            hintText="Sea específico en pocas palabras"
            floatingLabelText="Nombre de la Dinámica"
            onChange={this.onChange}
            name="nombreDinamica"
            type="text"
            fullWidth={true}
          />
          <TextField
            floatingLabelText="Descripción de la Dinámica"
            multiLine={true}
            onChange={this.onChange}
            name="descripcion"
            type="text"
            fullWidth={true}
          />
          <div className="padre">
            <div className="margin">
            <DatePicker
            hintText="Fecha de Inicio"
            value={this.state.newObj.fecha}
            onChange={this.handleChange}
          /> 
            </div>
            <div className="margin">
          <DatePicker
            hintText="Fecha de Cierre"
            value={this.state.newObj2.fecha}
            onChange={this.handleChange2}
          />
          </div>
          </div>  
            <AutoComplete
            floatingLabelText="Selecciona Marca(s)"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.marcas.map(marca => marca)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequestMarca}
          />
            <div style={styles2.wrapper}>
              {this.state.chipData.map(this.renderChip, this)}
            </div>
          <AutoComplete
            floatingLabelText="Activa/Inactiva"
            filter={AutoComplete.noFilter}
            openOnFocus={true}
            dataSourceConfig={ {text: 'text', value: 'value'}  }
            dataSource={dataSource2}
            onNewRequest={this.onNewRequest2}
          />
          <div>
            <div className="margin">
            <AutoComplete
              floatingLabelText="Selecciona la Zona"
              filter={AutoComplete.caseInsensitiveFilter}
              dataSource={this.state.zonas.map(zona => zona)}
              dataSourceConfig={ {text: 'nombre', value: '_id'}  }
              onNewRequest={this.onNewRequestZona}
            /> 
            <br/>
            <AutoComplete
            floatingLabelText="Selecciona Centro(s) de Consumo"
            hintText="Antes Seleccione Zona"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.centros.map(centro => centro)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequestCentro}
            />
            </div>
            <div style={styles2.wrapper}>
              {this.state.chipData2.map(this.renderChip2, this)}
            </div>
          </div>
          <br/>
            <FlatButton
            label="Elige una imagen"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
            backgroundColor="#00897B"
          > 
            <input onChange={this.getFile} name="imagenPremio" type="file" style={styles.uploadInput} />
          </FlatButton>
          <br/>
          <span>Espera la imagen tarda unos segundos en cargarse...</span>
          <br/><br/>
          <div className="senDinamica">
          <RaisedButton onClick={this.sendDinamic}  label="Crear Dinámica" secondary={true}  />
          </div>
      </Dialog> 
    </div>
    </div>
    );
  }
}

export default Dinamicas;