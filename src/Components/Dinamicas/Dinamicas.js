import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
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
import { createDinamic, getDinamics,getDinamicsByBrand,sendChangesDinamic,deleteDinamic } from '../../Services/dinamicas';
import { getMarcas } from '../../Services/marcas';
import DatePicker from 'material-ui/DatePicker';
import { getBrand } from '../../Services/brands';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import {green700,blue500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import firebase from '../../firebase/firebase';



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
    open4: false,
    open5:false,
    open6:false,
    open7:false,
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
    showCheckboxes: false,
    height: '300px',
    terminaStateTabla:"TERMINASTATE DE LA TABLA",
    progresoImagen:0,
    detalleDinamica:{},
    marcasDinamica:[],
    alReves:false,
    alReves2:false,
    alReves3:false,
    alReves4:false,
    dinamicaEditar:{},
    objEdit:{},
    objEdit2:{},
    progresoImagen2:0,
    value:null,
    puesto:null,
    hayEvidencias:false,
    boton:true
  }
  // REVISA EL BRAND AL QUE PERTENECE EL USUARIO QUE SE LOGUEO
  //SI ES DEL BRAND 1PUNTOCINCO "5b71bd925c65d40353ffda4c" TRAE TODAS LAS DINAMICAS EXISTENTES, TODAS LAS MARCAS EXISTENTES, VAYA UTILIZA SERVICIOS 
  //PARA TRAER DATOS GENERALES PORQUE ES UN SUPERADMIN.
  componentWillMount(){
    const puestoUser = `${JSON.parse(localStorage.getItem('user')).puesto}`
        //ID DEL BRAND
    const id = `${JSON.parse(localStorage.getItem('user')).brand}`;
    //SI ES SUPERADMIN USA ESTOS SERVICIOS
     if(id === "5b71bd925c65d40353ffda4c") {
       //SERVICIO PARA TRAER TODAS LAS DINAMICAS
       getDinamics()
     .then(dinamics=>{
       let brands = dinamics.map(dinamic => dinamic.brand.nombre);
       for(let i= 0; i < dinamics.length;i++) 
        {
          dinamics[i].brand = brands[i]
        }
        dinamics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
       this.setState({dinamicasFilter:dinamics,dinamics})
     })
     .catch(e=>console.log(e))
     //SERVICIO PARA TRAER TODAS LAS MARCAS 
     getMarcas()
     .then(marcas=>{
       this.setState({marcas})
     })
     .catch(e=>console.log(e))
     }
     //SI NO ES SUPERADMIN TRAE LA INFO DE SU BRAND AL QUE PERTENECE
     else if (id !== "5b71bd925c65d40353ffda4c"){
       getDinamicsByBrand(id)
       .then(dinamics=>{
        let brands = dinamics.map(dinamic => dinamic.brand.nombre);
        for(let i= 0; i < dinamics.length;i++) 
         {
           dinamics[i].brand = brands[i]
         }
         dinamics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
    //LAS TRAEMOS TODAS PORQUE LOS CENTROS DE CONSUMO SON DE USO GENERAL
    getZonas()
     .then(zonas=>{
      this.setState({zonas,puesto:puestoUser})
     })
     .catch(e=>console.log(e))
   }

// ABRIR Y CERRAR DIALOGOS, TAMBIEN ALGUNOS BORRAN INFORMACION INGRESADA EN LOS FORMULARIOS
//SOBRE TODO LOS HANDLECLOSE SON LOS QUE BORRAN INFO PARA QUE NO SE QUED EGUARDADA 
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({newDinamic:{}, open: false,newObj:{},newObj2:{},chipData:[],chipData2:[],progresoImagen:0,boton:true});
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
  handleOpen4 = () => {
    this.setState({open4: true});
  };
  handleClose4 = () => {
    this.setState({open4: false});
  };
  handleOpen5 = () => {
    this.setState({open5: true});
  };
  handleClose5 = () => {
    this.setState({open5: false,dinamicaEditar:{},objEdit:{},objEdit2:{},progresoImagen2:0,value:null});
  };
  handleOpen6 = () => {
    this.setState({open6: true});
  };
  handleClose6 = () => {
    this.setState({open6: false,dinamicaBorrar:{}});
  };
  handleOpen7 = () =>{
    this.setState({open7: true});
  }
  handleClose7 = () =>{
    this.setState({open7: false});
  }

  // NO COMPRENDI BIEN SU FUNCIONAMIENTO PERO LO QUE HACEN ES BORRAR LOS CHIPS DE LAS MARCAS SELECCIONADAS
  //Y LOS CENTROS DE CONSUMO SELECCIONADOS EN EL FORMULARIO DE CREAR DINAMICA 
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
  // SE ELIGEN LAS MARCAS PARTICIPANTES EN LA DINAMICA QUE SE ESTA CREANDO
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
// SE ELIGE EL STATUS ACTIVA/INACTIVA
onNewRequest2 = (chosenRequest) => {
  let {newDinamic} = this.state;
  newDinamic.activa = chosenRequest.value;
}
// SE ELIGE LA ZONA Y LA ZONA ELEGIDA NOS TRAE LOS CENTROS
onNewRequestZona = (chosenRequest) => {
  let {centros} = this.state;
  centros = chosenRequest.centros
  this.setState({centros});
}
 // SE ELIGEN LOS CENTROS DE CONSUMO PARTICIPANTES EN LA DINAMICA QUE SE ESTA CREANDO
 onNewRequestCentro = (chosenRequest) => {
  let { chipData2 } = this.state;
  let { newDinamic } = this.state;
  chipData2.push(chosenRequest)
  newDinamic.centroConsumo = chipData2;
  this.setState({chipData2,newDinamic})
}
//ESTA SUPER FUMADA ESTA FUNCION, PARECE QUE DETECTA EL EVENTO O LO QUE EL USUARIO ESCRIBE
//REVISA SI EL ID CONCUERDA CON EL E.TARGET.NAME DEL TEXT FIEL Y SI SI SIGNIFICA QUE LA CANTIDAD CORRESPODNE A ESA MARCA
//SUCEDE LO MISMO CON LA DESCRIPCION DE ESA MARCA....HAY QUE PRESTAR ATENCION EN DOND ESE USA ESTE ONCHANGE Y EL NAME DE LOS TEXT FIELD 
// EN POCAS PALABRAS ES PARA INGRESAR INFORMACION(CANTIDAD A VENDER O PUNTOS POR VENDER E INFORMACION ADICIONAL) A LAS MARCAS 
//SELECCIONADAS EN EL CHIPDATA DE LAS MARCAS.
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
// EL ONCHANGE QUE AGREGA INFORMACION A LA NUEVA DINAMICA QUE SE ESTA CREANDO
onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newDinamic} = this.state;
  newDinamic[field] = value;
  this.setState({newDinamic}); 
}
// EL ONCHANGE PARA EDITAR UNA DINAMICA
onChangeEdit = (e) =>{
  const field = e.target.name;
  const value = e.target.value;
  const {dinamicaEditar} = this.state;
  dinamicaEditar[field] = value;
  this.setState({dinamicaEditar}); 
}
// PARA INGRESAR LA FECHA DE INICIO A LA NUEVA DINAMICA QUE SE ESTE CREANDO
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
// PARA INGRESAR LA FECHA DE FIN A LA NUEVA DINAMICA QUE SE ESTE CREANDO
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
// PARA INGRESAR LA FECHA DE INICIO CUANDO SE EDITA UNA DINAMICA
handleChangeEdit = (event, date) => {
  let {dinamicaEditar,objEdit} = this.state;
  objEdit.fecha = date;
  dinamicaEditar.fechaInicio = date;
  this.setState({dinamicaEditar,objEdit});
};
// PARA INGRESAR LA FECHA DE FIN CUANDO SE EDITA UNA DINAMICA
handleChangeEdit2 = (event, date) => {
  let {dinamicaEditar,objEdit2} = this.state;
  objEdit2.fecha = date;
  dinamicaEditar.fechaFin = date;
  this.setState({dinamicaEditar,objEdit2});
};
// APROBAR O DESAPROBAR DINAMICAS, ESTA CUANDO SE TRATA DE EDITAR UNA DINAMICA
handleChangeDinamic = (event, index, value) => {
  if( value === "Desaprobada")
    {
      let {dinamicaEditar} = this.state;
      dinamicaEditar.status = value
      this.setState({dinamicaEditar,value})
    }
    else if ( value === "Aprobada")
    {
      let {dinamicaEditar} = this.state;
      dinamicaEditar.status = value
      this.setState({dinamicaEditar,value})
    }
};
// ENVIA LA IMAGEN A FIREBASE STORAGE Y NOS REGRESA UNA URL LA CUAL INSERTAMOS EN LA NUEVA DINAMICA QUE SE ESTA CREANDO
// TAMBIEN SE LE MUESTRA AL USUARIO EL AVANCE DE CARGA DE LA IMAGEN
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
    this.setState({newDinamic,boton:false})
  })
  .catch(e=>console.log(e)) //task
  //aqui reviso el progreso
  uploadTask.on('state_changed', (snap)=>{
    const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
    this.setState({progresoImagen});
  })
};
// ENVIA A FIREBASE STORAGE LA IMAGEN DE LA DINAMICA QUE SE ESTA EDITANDO...REPITO EEEEDIIIITAAAANDOOOOO
// Y SE LE MUESTRA EL PROGRESO DE LA IMAGEN AL USUARIO
getFileEdit = e => {
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
    const {dinamicaEditar} = this.state;
    dinamicaEditar.imagenPremio =  r.downloadURL;
    this.setState({dinamicaEditar})
  })
  .catch(e=>console.log(e)) //task
  //aqui reviso el progreso
  uploadTask.on('state_changed', (snap)=>{
    const progresoImagen2 = (snap.bytesTransferred / snap.totalBytes) * 100;
    this.setState({progresoImagen2});
  })
};
// SE UTILIZA PARA EL BUSCADOR DE LAS DINAMICAS, BUSCA POR NOMBRE DE DINAMICA, 
//BRAND, MODALIDAD, SOLO PUEDE BUSCAR POR 3 ITEMS MAXIMO
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
// FUNCIONES PARA ORDENAR LAS DINAMICAS DE DISTINTA MANERA 

// ORDENAR POR NOMBRE 
orderByName = (e) => {
  console.log('Sarabita, Otniel te quiere!!!')
  let {alReves} = this.state;
  if(alReves === false){
    let {dinamicasFilter} = this.state;
    dinamicasFilter.sort((a, b) => a.nombreDinamica.toLowerCase() !== b.nombreDinamica.toLowerCase() ? a.nombreDinamica.toLowerCase() < b.nombreDinamica.toLowerCase() ? -1 : 1 : 0)
    this.setState({dinamicasFilter,alReves:true})
  }
  else if(alReves === true){
    let {dinamicasFilter} = this.state;
    dinamicasFilter.sort((a, b) => b.nombreDinamica.toLowerCase() !== a.nombreDinamica.toLowerCase() ? b.nombreDinamica.toLowerCase() < a.nombreDinamica.toLowerCase() ? -1 : 1 : 0)
    this.setState({dinamicasFilter,alReves:false})
  }
}
// ORDENAR POR FECHA INICIAL
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
// ORDENAR POR FECHA DE FIN
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
//ORDENAR POR MODALIDAD
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
// SE USA PARA VER EL DETALLE DE CIERTA DINAMICA
detalleDinamica = (dinamic) => {
  this.handleOpen3()
  let {detalleDinamica,marcasDinamica} = this.state;
  detalleDinamica = dinamic;
  detalleDinamica.fechaInicio = dinamic.fechaInicio.slice(0,10)
  detalleDinamica.fechaFin = dinamic.fechaFin.slice(0,10)
  marcasDinamica = dinamic.marcaPuntosVentas;
  this.setState({detalleDinamica,marcasDinamica})
}
// PARA SACAR PAFUERA A UN USUARIO
outUser = (e) => {
  outUserDash()
  .then(logoutUser=>{
    this.props.history.push("/");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("statusEvidencia");
  })
  .catch(e=>alert(e))
}
// PARA ABRIR EL DIALOGO DE EDITAR DINAMICA, PASA INFORMACION DEL OBJETO DE LA DINAMICA ACTUAL AL OBJETO DETALLEDINAMICA
// Y ABRE EL DIALOGO PARA EDITAR UNA DINAMICA
editarDinamica = (dinamica) =>{
  let {detalleDinamica,hayEvidencias} = this.state;
  detalleDinamica = dinamica;
  detalleDinamica.fechaInicio = dinamica.fechaInicio.slice(0,10)
  detalleDinamica.fechaFin = dinamica.fechaFin.slice(0,10)
  if(detalleDinamica.evidencias[0]){
    hayEvidencias = true
  }
  else if(!detalleDinamica.evidencias[0]){
    hayEvidencias = false
  }
  this.setState({detalleDinamica,hayEvidencias})
  this.handleOpen5();
}
// ENVIA LA DINAMICA QUE SE ESTA CREAND...REPITOLA DINAMICA QUE SE ESTA CREEEAAAANDOOOOO.
// USA UN SERVICIO QUE NOS UNE CON NUESTRO BACKEND
sendDinamic = (e) => {
  const { newDinamic } = this.state;
  newDinamic.brand = `${JSON.parse(localStorage.getItem('user')).brand}`;
  createDinamic(newDinamic)
  .then(dinamic=>{
    this.handleClose();
    window.location.reload()
  })
  .catch(e=>console.log(e))
}
// ENVIA LOS CAMBIOS DE LA DINAMICA QUE SE ESTA EDITAAAAANDOOOOOO REPITO EEEEEDIIIITAAAAAANDOOOOOOO
// USA UN SERVICIO QUE NOS UNE CON NUESTRO BACKEND
sendChangesDinamic = () =>{
  let {dinamicaEditar,detalleDinamica} = this.state;
  let id = detalleDinamica._id;
  sendChangesDinamic(id,dinamicaEditar)
  .then(dinamic=>{
    this.handleClose5();
    window.location.reload()
  })
  .catch(e=>console.log(e))
}
//ENVIA LA LA DINAICA QUE SE QUIERE BORRAR Y ABRE EL DIALOGO PARA PREGUNTARLE SI ESTA SEGURO
//EL BOTON DE BORRAR DINAMICA SOLO ESTARA HABILITADO SI UNA DINAMICA NO HA RECOGIDO INFORMACION O EVIDENCIAS, SI YA LO HIZO 
// EL BOTON ESTARA DESHABILITADO
borrarDinamica = (dinamica) =>{
  this.setState({dinamicaBorrar:dinamica})
  this.handleOpen6();
}
// ESTA ES LA FUNCION QUE BORRA UNA DINAMICA Y OBVIO USA UN SERVICIO QUE NOS CONECTA CON EL BACKEND
deleteDinamic = () => {
  let {dinamicaBorrar} = this.state;
  deleteDinamic(dinamicaBorrar._id)
  .then(r=>{
    this.handleClose6();
    window.location.reload()
  })
  .catch(e=>console.log(e))
}

// UNA FUNCION QUE NOS LLEVE MEDIANTE EL PUSH HISTORY A LA RUTA DE EVIDENCIAS POR DINAMICA
evidenciasPorDinamica =(dinamica)=>{
  this.props.history.push(`/tickets/${dinamica._id}`);
}


// LOS CHIPS DE LAS MARCAS AQUI DEBES DE PRESTAR ATENCION A ONCHANGE DE LOS TEXTFIELD 
//Y AL NAME DE LOS TEXTFIELD PORQUE USAMOS ESOS PARA AGREGAR LA INFO EN LOS ONCHANGES CORRESPONDIENTES
// ES EL ONCHANGE LOCO DEL QUE HABLE ARRIBA SE LLAMA ONCHANGEMARCA
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
// LOS CHIPS QUE USAMOS PARA AGREGAR CENTROS DE CONSUMO A LA DINAMICA 
// QUE SE ESTA CREANDO
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
    const actions6 = [
      <RaisedButton 
        onClick={this.sendDinamic}  
        label="Crear Dinámica" 
        backgroundColor="#0D47A1"
        labelColor="#FAFAFA" 
        disabled={this.state.boton}
      />
    ]
    const actions5 = [
      <FlatButton
        label="Si estoy seguro"
        primary={true}
        keyboardFocused={true}
        onClick={this.deleteDinamic}
      />,
      <FlatButton
        label="Cancelar"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose6}
      />
    ];
    const actions4 = [
      <FlatButton
        label="Enviar Cambios"
        primary={true}
        keyboardFocused={true}
        onClick={this.sendChangesDinamic}
      />,
      <FlatButton
        label="Cerrar"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose5}
      />
    ];
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
    const {detalleDinamica,marcasDinamica,puesto,hayEvidencias} = this.state;
    return (
    <div>
       <Dash/>
       <div>
       <div>
       <RaisedButton 
       label="Salir"  
       onClick={this.outUser} 
       className="outDinamicasResponsive" 
       labelStyle={{fontSize:'12px'}}
       backgroundColor="#B71C1C"
       labelColor="#FAFAFA"
       />
       </div>
       </div>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="CREAR DINÁMICA"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            labelPosition="before"
            icon={<FontIcon className="material-icons">queue_play_next</FontIcon>}
            //style={styles.button}
            className="crearDinamicaResponsive"
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
              <TableHeaderColumn colSpan="6" style={{textAlign: 'center'}}>
                Dinámicas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              {/* <TableHeaderColumn><h3 onClick={this.orderByModality}>Modalidad</h3></TableHeaderColumn> */}
              <TableHeaderColumn><h3>BRAND</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Estatus</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByName}>Nombre</h3></TableHeaderColumn>
              {/* <TableHeaderColumn><h3 onClick={this.orderByInitDate}>Fecha de Inicio</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByFinishDate}>Fecha de Término</h3></TableHeaderColumn> */}
              <TableHeaderColumn><h3>Ver</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Editar</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Evidencias</h3></TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.dinamicasFilter.map( (dinamic, index) => (
              <TableRow key={dinamic._id} data={dinamic}>
                {/* <TableRowColumn>{dinamic.modalidad}</TableRowColumn> */}
                <TableRowColumn>{dinamic.brand}</TableRowColumn>
                <TableRowColumn>{dinamic.status}</TableRowColumn>
                <TableRowColumn>{dinamic.nombreDinamica}</TableRowColumn>
                {/* <TableRowColumn>{dinamic.fechaInicio.slice(0,10)}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaFin.slice(0,10)}</TableRowColumn> */}
                <TableRowColumn><button className="buttonDinamicasDetalle" onClick={() => this.detalleDinamica(dinamic)}>Ver Detalle</button></TableRowColumn>
                <TableRowColumn><button className="botonDinamicaEditar" onClick={() => this.editarDinamica(dinamic)}>Editar</button></TableRowColumn>
                <TableRowColumn><button className="botonDinamicaBorrar" onClick={() => this.evidenciasPorDinamica(dinamic)}>Evidencias</button></TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
       <h5 onClick={this.handleOpen7}>* ¿Porqué el botón de borrar parece no funcionar?</h5>
       </div>
       </div>
       <div >
          <Dialog
            title="Crea una Dinámica"
            modal={false}
            actions={actions6}
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
            autoOk={true}
            container="inline"
          /> 
            </div>
            <div className="margin">
          <DatePicker
            hintText="Fecha de Cierre"
            value={this.state.newObj2.fecha}
            onChange={this.handleChange2}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
            autoOk={true}
            container="inline"
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
          <div>
          <Dialog
          title={<h2>Editar Dinámica</h2>}
          actions={actions4}
          modal={false}
          open={this.state.open5}
          onRequestClose={this.handleClose5}
          autoScrollBodyContent={true}
          >
              <div style={puesto === "SUPERADMIN" || puesto === "GERENTE" ? {display:"block"} : {display:"none"}}>
              <br/>
              <span className="spanAprobarDinamicas">Aprueba o Rechaza esta Dinámica</span>
              <br/>
              <SelectField
                floatingLabelStyle={{fontSize:22}}
                floatingLabelText="Elige una opción"
                value={this.state.value}
                onChange={this.handleChangeDinamic}
              >
                <MenuItem value="Aprobada" primaryText="Aprobada" />
                <MenuItem value="Desaprobada" primaryText="Desaprobada" />
              </SelectField>

              <hr/>
              </div>
              
            <img alt="Imagen Premio" width="300px" height="250px" src={detalleDinamica.imagenPremio} />
            <br/>
            <FlatButton
            label="Cambiar  imagen"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
            backgroundColor="#00897B"
          > 
            <input onChange={this.getFileEdit} name="imagenPremio" type="file" style={styles.uploadInput} />
          </FlatButton>
            <br/><br/>
            <LinearProgress mode="determinate" value={this.state.progresoImagen2} />
            <span>{this.state.progresoImagen2 >= 100 ? "Listo tu imagen se ha cargado correctamente!" : (this.state.progresoImagen2 > 0 && this.state.progresoImagen2 < 98 ? "Espera la imagen se esta cargando..." : "La imagen tarda unos segundos en cargar...")}</span>
            <br/><br/>  
            <hr/>
            <h5>Nombre de la Dinámica:</h5>
            <h2>{detalleDinamica.nombreDinamica}</h2>
            <TextField
            hintText="Sea específico en pocas palabras"
            floatingLabelText="Edita el Nombre de la Dinámica"
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Llena solo los campos a editar"
            errorStyle={styles.errorStyle}
            type="text" 
            onChange={this.onChangeEdit}
            name="nombreDinamica"
          />
            <hr/>
            <h5>Descripción de la Dinámica:</h5>
            <b>{detalleDinamica.descripcion}</b>
            <br/>
            <TextField
            floatingLabelText="Edita la Descripción de la Dinámica"
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Llena solo los campos a editar"
            errorStyle={styles.errorStyle}
            type="text" 
            multiLine={true}
            rowsMax={4}
            fullWidth={true}
            onChange={this.onChangeEdit}
            name="descripcion"
          />
            <hr/>
            <h5>Duración de la Dinámica:</h5>
            <span>{detalleDinamica.fechaInicio}<b> hasta </b>{detalleDinamica.fechaFin}</span>
            <br/>
            <div className="padre">
            <div className="margin">
            <DatePicker
            hintText="Editar Fecha Inicial"
            value={this.state.objEdit.fecha}
            onChange={this.handleChangeEdit}
            errorText="Llena solo los campos a editar"
            errorStyle={styles.errorStyle}
          /> 
            </div>
            <b>        </b>
            <div className="margin">
          <DatePicker
            hintText="Editar Fecha Final"
            value={this.state.objEdit2.fecha}
            onChange={this.handleChangeEdit2}
            errorText="Llena solo los campos a editar"
            errorStyle={styles.errorStyle}
          />
          </div>
          </div> 
          <br/><hr/>
          <button disabled={hayEvidencias ? true : false} className="botonDinamicaBorrar" onClick={() => this.borrarDinamica(detalleDinamica)}>Borrar</button>
          </Dialog>
        </div>
        <div>
          <Dialog
          title="¿Estás seguro?"
          modal={false}
          actions={actions5}
          open={this.state.open6}
          onRequestClose={this.handleClose6}
          autoScrollBodyContent={true}
        >
          Esta decisión es irreversible, si borras esta dinámica sera de manera permanente y no podras visualizar mas tarde ningún detalle relacionada a esta. 
        </Dialog>
          </div>
          <div>
          <Dialog
          modal={false}
          open={this.state.open7}
          onRequestClose={this.handleClose7}
          autoScrollBodyContent={true}
        >
          El botón esta inhabilitado para las dinámicas que ya han recogido datos.
          <br/><br/>
          Si deseas borrar una dinámica en donde el boton de borrar esta inhabilitado 
          por favor contacta a soporte al correo <b>german@1puntocinco.com</b>, ¡Gracias!
        </Dialog>
          </div>
    </div>
    );
  }
}
export default Dinamicas;