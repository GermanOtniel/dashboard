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
import { outUserDash } from '../../Services/authDash';
import { createDinamic, getDinamics,getDinamicsByBrand } from '../../Services/dinamicas';
import { getMarcas } from '../../Services/marcas';
import DatePicker from 'material-ui/DatePicker';
import { getBrand } from '../../Services/brands';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import {green700,blue500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import firebase from '../../firebase/firebase';
import './dinamicas.css';

const styleButtonOut = {
  float: 'right'
}

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
    marcasDinamica:[],
    open4: false,
    alReves:false,
    alReves2:false,
    alReves3:false,
    alReves4:false
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
     //ESTE ES EL SERVICIO PARA TRAER LAS DINAMICAS QUE EXISTEN Y REPRESENTARLAS EN LA TABLA
     if(id === "5b71bd925c65d40353ffda4c") {
       getDinamics()
     .then(dinamics=>{
       let brands = dinamics.map(dinamic => dinamic.brand.nombre);
       for(let i= 0; i < dinamics.length;i++) 
        {
          dinamics[i].brand = brands[i]
        }
        dinamics.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
       this.setState({dinamicasFilter:dinamics,dinamics})
     })
     .catch(e=>console.log(e))
     //COMO ES SUPER ADMIN PUEDE CREAR DINAMICAS CON LA MARCA QUE SEA 
     getMarcas()
     .then(marcas=>{
       this.setState({marcas})
     })
     .catch(e=>console.log(e))
     }
     else if (id !== "5b71bd925c65d40353ffda4c"){
       getDinamicsByBrand(id)
       .then(dinamics=>{
        let brands = dinamics.map(dinamic => dinamic.brand.nombre);
        for(let i= 0; i < dinamics.length;i++) 
         {
           dinamics[i].brand = brands[i]
         }
         dinamics.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
        this.setState({dinamicasFilter:dinamics,dinamics})
      })
      .catch(e=>console.log(e))
       //TRAEMOS EL BRAND PARA POPULAR SUS MARCAS Y TENER LAS MARCAS PARA EL AUTOCOMPLETE DE MARCAS
    getBrand(id)
    .then(brand=>{
      let {marcas} = this.state;
      marcas = brand.marcas
      this.setState({marcas})
    })
    .catch(e=>console.log(e))
     }
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
    this.setState({newDinamic:{}, open: false,newObj:{},newObj2:{},chipData:[],chipData2:[],progresoImagen:0});
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
    if(field === 'info'+chipData[i]._id){
      chipData[i].descripcion = value
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
  const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
  const date = new Date();
  const date2 = String(date).slice(16,24)
  const numberRandom = Math.random();
  const number = String(numberRandom).slice(2,16)
  const child = correo + date2 + number
  //aqui lo declaro
  const uploadTask = firebase.storage()
  .ref("dinamicas")
  .child(child)
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
handleOpen4 = () => {
  this.setState({open4: true});
};

handleClose4 = () => {
  this.setState({open4: false});
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
      e.target.value.toLowerCase()) !== -1 || item.brand.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1 || item.modalidad.toLowerCase().search(
          e.target.value.toLowerCase()) !== -1;
  });
  this.setState({dinamicasFilter: updatedList})
}

orderByName = (e) => {
  console.log('Sarabita, Otniel te quiere!!!')
  let {alReves} = this.state;
  if(alReves === false){
    let {dinamicasFilter} = this.state;
    dinamicasFilter.sort((a, b) => a.nombreDinamica !== b.nombreDinamica ? a.nombreDinamica < b.nombreDinamica ? -1 : 1 : 0)
    this.setState({dinamicasFilter,alReves:true})
  }
  else if(alReves === true){
    let {dinamicasFilter} = this.state;
    dinamicasFilter.sort((a, b) => b.nombreDinamica !== a.nombreDinamica ? b.nombreDinamica < a.nombreDinamica ? -1 : 1 : 0)
    this.setState({dinamicasFilter,alReves:false})
  }
}
orderByInitDate = (e) => {
  let {alReves2} = this.state;
    if(alReves2 === false){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
      this.setState({dinamicasFilter,alReves2:true})
    }
    else if(alReves2 === true){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
      this.setState({dinamicasFilter,alReves2:false})
    }
}
orderByFinishDate = (e) => {
  let {alReves3} = this.state;
    if(alReves3 === false){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => new Date(a.fechaFin) - new Date(b.fechaFin))
      this.setState({dinamicasFilter,alReves3:true})
    }
    else if(alReves3 === true){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin))
      this.setState({dinamicasFilter,alReves3:false})
    }
}
orderByModality = (e) => {
  let {alReves4} = this.state;
    if(alReves4 === false){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => a.modalidad !== b.modalidad ? a.modalidad < b.modalidad ? -1 : 1 : 0)
      this.setState({dinamicasFilter,alReves4:true})
    }
    else if(alReves4 === true){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => b.modalidad !== a.modalidad ? b.modalidad < a.modalidad ? -1 : 1 : 0)
      this.setState({dinamicasFilter,alReves4:false})
    }
}
outUser = (e) => {
  outUserDash()
  .then(logoutUser=>{
    this.props.history.push("/");
    window.localStorage.removeItem("user");
  })
  .catch(e=>alert(e))
}

renderChip(data) {
  return (
   <div className="chipDinamica" key={data.nombre}>
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
  <br/>
  <TextField
    onChange={this.onChangeMarca}
    name={`info${data._id}`}
    type="text"
    multiLine={true}
    rowsMax={4}
    floatingLabelText="Agrega información de la marca:"
    hintText="Máximo 150 caracteres"
    maxLength={150}
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
    const actions3 = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose4}
      />,
    ];
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
       <div>
       <div>
       <RaisedButton label="Salir" secondary={true} onClick={this.outUser} style={styleButtonOut}/>
       </div>
       </div>
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
              <TableHeaderColumn><h3 onClick={this.orderByModality}>Modalidad</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>BRAND</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByName}>Nombre</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Status</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByInitDate}>Fecha de Inicio</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByFinishDate}>Fecha de Término</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Ver</h3></TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.dinamicasFilter.map( (dinamic, index) => (
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
          <hr/>
          <h4>¿Deseas revisar las evidencias que produzca esta dinámica? <button onClick={this.handleOpen4} className="botonInfoDinamicas"> ? </button></h4> 
          <RadioButtonGroup onChange={this.onChange} name="checkEvidences" >
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
          {/* vidcar.gonzalez@cuamoc.com  */}
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
        <img alt="Imagen Premio" width="300px" height="250px" src={detalleDinamica.imagenPremio} />
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
          <div>
          <Dialog
          title="Información:"
          modal={false}
          actions={actions3}
          open={this.state.open4}
          onRequestClose={this.handleClose4}
          autoScrollBodyContent={true}
        >
        Esta opción te da la oportunidad de:
        <br/> <br/>
        1) Revisar las evidencias que produzca esta 
        dinámica para a su vez aprobarlas o rechazarlas.
        <br/> <br/>
        2) Ó en su defecto no tener la necesidad de revisar las evidencias y que todas estas 
        salgan como aprobadas automáticamente, para así evitarte estar aprobandolas ó rechazandolas.
        <br/><br/>
        Si deseas la opción número 1 elige "SI", si deseas la opción número 2 elige "NO".
        <br/><br/>
        <b>Esta decisión es trascendental en el desempeño de una dinámica, asegurate de elegir la opción correcta</b>
        </Dialog>
          </div>
    </div>
    );
  }
}

export default Dinamicas;