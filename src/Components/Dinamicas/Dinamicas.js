import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Avatar from 'material-ui/Avatar';
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
import DatePicker from 'material-ui/DatePicker';
import { getBrand } from '../../Services/brands';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import {green700,blue500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
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
    color: '#FAFAFA'
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
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
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
    open2:false,
    open3:false,
    centros:[],
    zonas:[],
    marcas:[],
    dinamicasFilter:[],
    newDinamic:{},
    putosMarcas:[],
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
    height: '300px',
    progresoImagen:0,
    detalleDinamica:{},
    marcasDinamica:[]
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
     //ESTE ES EL SERVICIO PARA TRAER LAS DINAMICAS QUE EXISTEN Y REPRESENTARLAS EN LA TABLA
     getDinamics()
     .then(dinamics=>{
       let brands = dinamics.map(dinamic => dinamic.brand.nombre);
       for(let i= 0; i < dinamics.length;i++) 
        {
          dinamics[i].brand = brands[i]
        }
       //this.setState({dinamics})
       this.setState({dinamicasFilter:dinamics,dinamics})
     })
     .catch(e=>console.log(e))
    //ID DEL BRAND
    const id = `${JSON.parse(localStorage.getItem('user')).brand}`;
    //TRAEMOS EL BRAND PARA POPULAR SUS MARCAS Y TENER LAS MARCAS PARA EL AUTOCOMPLETE DE MARCAS
    getBrand(id)
      .then(brand=>{
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
   }


  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({newDinamic:{}, open: false,newObj:{},newObj2:{},chipData:[],chipData2:[]});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };

  handleClose2 = () => {
    this.setState({open2: false});
  };
 
  onNewRequestMarca = (chosenRequest) => {
    let { chipData } = this.state;
    let { newDinamic } = this.state;
    if(newDinamic.modalidad === "Puntos"){
    chipData.push(chosenRequest);
    //newDinamic.marcas = chipData;
    this.setState({chipData})
    }
    else if(newDinamic.modalidad === "Ventas"){
    chipData.push(chosenRequest);
    //newDinamic.marcas = chipData;
    this.setState({chipData})
    }
    else{
      this.handleOpen2();
    }
}
onChangeMarca = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {chipData} =this.state;
  const {newDinamic} = this.state;
  for(let i = 0; i<chipData.length;i++){
    if(field === chipData[i]._id){
      chipData[i].puntosVentas = value
    }
  }
  newDinamic.marcaPuntosVentas = chipData;
  this.setState({newDinamic,chipData})
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
  let {newDinamic} = this.state;
  //let fecha = String(date);
  //newDinamic.fechaInicio = fecha.slice(4,15);
  newDinamic.fechaInicio = date;
  this.setState({newDinamic});
  const {newObj} = this.state;
  newObj.fecha = date;
  this.setState({newObj});
};
handleChange2 = (event, date) => {
  let {newDinamic} = this.state;
  //let fecha = String(date);
  //newDinamic.fechaFin = fecha.slice(4,15);
  newDinamic.fechaFin = date;
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
    const {newDinamic} = this.state;
    newDinamic.imagenPremio =  r.downloadURL;
    this.setState({newDinamic})
  })
  .catch(e=>console.log(e)) //task
  //aqui reviso el progreso
  uploadTask.on('state_changed', (snap)=>{
    const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
    this.setState({progresoImagen});
  })
};
sendDinamic = (e) => {
  const { newDinamic } = this.state;
  newDinamic.brand = `${JSON.parse(localStorage.getItem('user')).brand}`;
  createDinamic(newDinamic)
  .then(dinamic=>{
    this.handleClose();
  })
  .catch(e=>console.log(e))
}
handleOpen3 = () => {
  this.setState({open3: true});
};

handleClose3 = () => {
  this.setState({open3: false});
};
detalleDinamica = (dinamic) => {
  this.handleOpen3()
  let {detalleDinamica,marcasDinamica} = this.state;
  detalleDinamica = dinamic;
  detalleDinamica.fechaInicio = dinamic.fechaInicio.slice(0,10)
  detalleDinamica.fechaFin = dinamic.fechaFin.slice(0,10)
  marcasDinamica = dinamic.marcaPuntosVentas;
  this.setState({detalleDinamica,marcasDinamica})
}

filterList = (e) =>{
  var updatedList = this.state.dinamics.map(dinamic=>dinamic);
  updatedList = updatedList.map(dinamic=>dinamic).filter(function(item){
    return item.nombreDinamica.toLowerCase().search(
      e.target.value.toLowerCase()) !== -1;
  });
  this.setState({dinamicasFilter: updatedList})
}
renderChip(data) {
  return (
   <div key={data.nombre}>
    <Chip
      
      onRequestDelete={() => this.handleRequestDelete(data.nombre)}
      style={styles2.chip}
    >
      {data.nombre}
    </Chip>
    <TextField
    onChange={this.onChangeMarca}
    name={`${data._id}`}
    type="number"
    hintText="Puntos o Ventas por Marca"
  />
    </div>
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
    const actions2 = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose3}
      />,
    ];
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose2}
      />,
    ];
    const {detalleDinamica,marcasDinamica} = this.state;
    return (
    <div>
       <Dash/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="CREA UNA DINAMICA"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            labelPosition="before"
            icon={<FontIcon className="material-icons">queue_play_next</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
          /> 
         </div>
       </div>
       <div>
       <div className="buscador">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Busca una dinámica" type="text" onChange={this.filterList}/>
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
          >
            {this.state.dinamicasFilter.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
.map( (dinamic, index) => (
              <TableRow key={dinamic._id} data={dinamic}>
                <TableRowColumn>{dinamic.modalidad}</TableRowColumn>
                <TableRowColumn>{dinamic.brand}</TableRowColumn>
                <TableRowColumn>{dinamic.nombreDinamica}</TableRowColumn>
                <TableRowColumn>{dinamic.status}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaInicio.slice(0,10)}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaFin.slice(0,10)}</TableRowColumn>
                <TableRowColumn><button className="buttonDinamicasDetalle" onClick={() => this.detalleDinamica(dinamic)}>Ver Detalle</button></TableRowColumn>

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
          <h4>Modalidad de la Dinámica</h4>
          <RadioButtonGroup onChange={this.onChange} name="modalidad" >
          <RadioButton 
          value="Ventas"
          label="Ventas"
          />
          <RadioButton 
          value="Puntos"
          label="Puntos"
          />
          </RadioButtonGroup>
          <hr/>
          <h4>¿Requerira imagen como evidencia?</h4>
          <RadioButtonGroup onChange={this.onChange} name="imagen" >
          <RadioButton 
          value={true}
          label="Si"
          />
          <RadioButton 
          value={false}
          label="No"
          />
          </RadioButtonGroup>
          
          <TextField
            hintText="Sea específico en pocas palabras"
            floatingLabelText="Nombre de la Dinámica"
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
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
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />
          <div className="padre">
            <div className="margin">
            <DatePicker
            hintText="Fecha de Inicio"
            value={this.state.newObj.fecha}
            onChange={this.handleChange}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          /> 
            </div>
            <div className="margin">
          <DatePicker
            hintText="Fecha de Cierre"
            value={this.state.newObj2.fecha}
            onChange={this.handleChange2}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />
          </div>
          </div>  
          <hr/>
          <b>Para seleccionar otra Marca borra la primera y repite el proceso.</b>
          <br/>
            <AutoComplete
            floatingLabelText="Selecciona Marca(s)"

            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.marcas.map(marca => marca)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequestMarca}
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
          />
            <div style={styles2.wrapper}>
              {this.state.chipData.map(this.renderChip, this)}
            </div>
            <hr/>
          <AutoComplete
            floatingLabelText="Activa/Inactiva"
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
          <div>
          <hr/>
            <div className="margin">
            <b>Primero debes de Seleccionar la Zona</b>
            <br/>
            <AutoComplete
              floatingLabelText="Selecciona la Zona"
              filter={AutoComplete.caseInsensitiveFilter}
              dataSource={this.state.zonas.map(zona => zona)}
              dataSourceConfig={ {text: 'nombre', value: '_id'}  }
              onNewRequest={this.onNewRequestZona}
              floatingLabelStyle={styles.floatingLabelFocusStyle}
              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
              errorText="Este campo es obligatorio"
              errorStyle={styles.errorStyle}
            /> 
            <br/>
            <b>Para seleccionar otra Centro de Consumo borra el primero y repite el proceso.</b>
            <br/>
            <AutoComplete
            floatingLabelText="Selecciona Centro(s) de Consumo"
            hintText="Antes Seleccione Zona"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.centros.map(centro => centro)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequestCentro}
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
            />
            </div>
            <div style={styles2.wrapper}>
              {this.state.chipData2.map(this.renderChip2, this)}
            </div>
            <hr/>
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
          <br/><br/>
          <LinearProgress mode="determinate" value={this.state.progresoImagen} />
          <span>{this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" : (this.state.progresoImagen > 0 && this.state.progresoImagen < 98 ? "Espera la imagen se esta cargando..." : "Adjunta una imagen")}</span>
          <br/><br/>
          <div className="senDinamica">
          <RaisedButton 
          onClick={this.sendDinamic}  
          label="Crear Dinámica" 
          backgroundColor="#0D47A1"
          labelColor="#FAFAFA" 
          />
          </div>
      </Dialog> 
    </div>
    <div>
    <Dialog
          title="Te hace falta algo..."
          actions={actions}
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
        >
          Debes de elegir primero una modalidad de la Dinámica.
        </Dialog>
        </div>
        <div>
          <Dialog
          title="Detalle de Dinamica"
          actions={actions2}
          modal={false}
          open={this.state.open3}
          onRequestClose={this.handleClose3}
          autoScrollBodyContent={true}
        >
        <img width="300px" height="250px" src={detalleDinamica.imagenPremio} />
        <hr/>
        <h5>Nombre de la Dinámica:</h5>
        <h2>{detalleDinamica.nombreDinamica}</h2>
        <hr/>
        <h5>Modalidad de la Dinámica:</h5>
        <h3>{detalleDinamica.modalidad}</h3>
        <b className="imagenDinamicaDetail">{detalleDinamica.imagen ? "Esta dinámica SI requiere imagen como evidencia" : "Esta dinámica NO requiere imagen como evidencia"} </b>
        <hr/>
        <h5>Descripción de la Dinámica:</h5>
        <b>{detalleDinamica.descripcion}</b>
        <hr/>
        <h5>Duración de la Dinámica:</h5>
        <span>{detalleDinamica.fechaInicio}<b> hasta </b>{detalleDinamica.fechaFin}</span>
        
        <br/>
        <hr/>
        <br/>
        <h3>{detalleDinamica.modalidad === "Ventas" ? "Ventas requeridas por marca: " : "Puntos por unidad vendida: "}</h3>     
        <br/>
        {marcasDinamica.map( (marca, index) => (
              <div key={index}>
              <Chip
              className="dinamicDetailHijo"
              >
              <Avatar src={marca._id.imagen} />
                {marca._id.nombre}
                 <b>{ " " + marca.puntosVentas }</b>
              </Chip> 
              <br/><br/>
              </div>
              ))}
        </Dialog>
          </div>
    </div>
    );
  }
}

export default Dinamicas;