import React, {Component} from 'react';
import { getSingleDinamic } from '../../Services/dinamicas';
import { getEvidencesByDinamic,getEvidencesByDinamicAndByDate } from '../../Services/evidencias';
import { getCenter } from '../../Services/centro';
import { makeWinner } from '../../Services/dinamicas';
import Dash from '../Dash/Dashboard';
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'material-ui/DatePicker';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import {green700} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';


const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};

const style = {
  height: '100%',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block'
};
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'white',
  },
  radioButton: {
    marginTop: 16,
  },
  errorStyle: {
    color: green700,
  },
  chip: {
    margin: 1
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'center'
  }
};




class DinamicaDetail extends Component{

  state={
    dinamica:{},
    newCreadores:[],
    evidencias:[],
    centros:[],
    marcas:[],
    open: false,
    open2: false,
    open3: false,
    open4: false,
    open5: false,
    open6: false,
    detalleCreador: {},
    marcasCreador: [],
    posibleGanador:{},
    marcaVentas:{},
    newMarcas:[],
    centroDetalle:{},
    centro:{},
    ganadores:[],
    detalleGanador:{},
    marcasGanador:[],
    porFecha:false,
    reporteCompleto:false,
    newObj:{},
    newObj2:{},
    botonFecha:true
  }

  // ESTE SE COMPONENTE LE D APRIMERO LA OPCION AL USUARIO DE ELEGIR SI QUIERE VER EL REPORTE POR FECHA DETERMINADA 
  // O DE MANERA COMPLETA, EL HANDLEOPEN6 ABRE UN DIALOGO INFORMATIVO QUE LE DA LA OPCION DE ELEGIR O REPORTE COMPLETO
  // O POR FECHA 
  componentWillMount(){
    this.handleOpen6()
  }

  // SI EL USUARIO ELIGE LA OPCION DE FECHA, DEBE D EINGRESAR FECHA INCIAL Y FECHA FINAL
  //Y POSTERIORMENTE SE EJECUTA ESTA FUNCION
  quieroFecha = () =>{
    let id = this.props.match.params.id
    let {newObj,newObj2} = this.state;
    let dia = newObj.fecha.getDate()
    let mes = newObj.fecha.getMonth() 
    let año = newObj.fecha.getFullYear()
    let dia2 = newObj2.fecha.getDate()
    let mes2 = newObj2.fecha.getMonth()
    let año2 = newObj2.fecha.getFullYear()
    let fechaInicio = new Date(año,mes,dia).getTime();
    let fechaFin    = new Date(año2,mes2,dia2).getTime();
    let diff = fechaFin - fechaInicio;
    let diasNumero = diff/(1000*60*60*24) 
    let fechasArray = []
    for(let i = 0; i <= diasNumero; i++){
      fechasArray.push(String(new Date(año,mes,dia + i)).slice(0,15))
    }
    // HASTA AQUI SE TIENE DENTRO DE UN ARRAY TODAS LAS FECHAS DE LAS EVIDENCIAS QUE DEBE DE BUSCAR NUESTRO SERVCIO 
    // LLAMADO getEvidencesByDinamicAndByDate
    getSingleDinamic(id)
    .then(dinamica=>{
        let {ganadores} = this.state;
        let marcas = dinamica.marcaPuntosVentas.map(marca=>marca._id);
        let { centros } = this.state;
      dinamica.fechaInicio = dinamica.fechaInicio.slice(0,10)
      dinamica.fechaFin = dinamica.fechaFin.slice(0,10)
      centros = dinamica.centroConsumo.map(centro=>centro);
      getEvidencesByDinamicAndByDate(id,fechasArray)
      .then(evidencias=>{  
        // CUANDO YA TENEMOS LAS EVIDENCIAS POR FECHA DETERMINADA HACEMOS USO DE LA FUNCION this.usuariosUnicos QUE ESTA MAS ABAJO
        // ESTA VA A TRABAJAR A PARTIR DE LAS EVIDENCIAS QUE LE MANDEMOS, LO QUE VA A HACER ES DEJARNOS UNA LISTA DE USUARIOS UNICOS

        this.usuariosUnicos(evidencias)  

        // HASTA AQUI YA TENEMOS A LOS USUARIOS Y SUS RESPECTIVAS EVIDENCIAS

        let {newCreadores} = this.state;

// AHORA QUEREMOS SUMAR SUS EVIDENCIAS RESPECTO A LA MARCA QUE VENDIERON, ES DECIR:
// SI VENDIERON EN UNA EVIDENCIA 20 COCAS Y DESPUES EN OTRA 3 COCAS, 
//QUEREMOS QUE SE IDENTIFIQUEN QUE SON VENTAS DEL MISMO PRODUCTO Y QUE SE SUMEN ( 20 + 3 ) = 23

// ESTOS CICLOS LO QUE HACEN ES DARLE LAS MARCAS QUE SE VENDIERON EN ESTA DINAMICA A CADA USUARIO:
      var lookupObject3  = {};
      for(let z = 0; z < newCreadores.length; z++){
        for(var ii in newCreadores[z].ventasDinamica) {
          lookupObject3[newCreadores[z].ventasDinamica[ii]['id']] = newCreadores[z].ventasDinamica[ii];
        }
        for(ii in lookupObject3) {
          newCreadores[z].marcas.push(lookupObject3[ii]);
       }
      }

      // AQUI SE ADENTRA A CADA USUARIO Y SE BUSCA:
      // SI SON MARCAS IGUALES QUE SE SUMEN SUS VENTAS 
     for(let x = 0; x < newCreadores.length; x++){
       for (let v = 0; v < newCreadores[x].marcas.length; v++){
          for ( let y = 0; y < newCreadores[x].ventasDinamica.length; y++){
            if(newCreadores[x].marcas[v]._id._id === newCreadores[x].ventasDinamica[y]._id._id  ){
              newCreadores[x].marcas[v].puntosUsuario += newCreadores[x].ventasDinamica[y].ventas
              newCreadores[x].marcas[v].nombre = newCreadores[x].ventasDinamica[y]._id.nombre
            }
          }
      }
     }
           // HASTA AQUI LOGRAMOS TENER YA A CADA USUARIO CON SUS VENTAS YA SUMADAS POR MARCA 


           // AQUI REVISAMOS SI EL USUARIO YA ES UN GANADOR 
     for (let ab = 0; ab < newCreadores.length; ab++){
       for( let g = 0; g < dinamica.ganadores.length; g++){
        if(dinamica.ganadores[g] === newCreadores[ab]._id){
          newCreadores[ab].ganador = true
          ganadores.push(newCreadores[ab])
        }
       }
       if(dinamica.modalidad === "Ventas"){
          // SI LA DINAMICA ES DE VENTAS; SUMAMOS SUS VENTAS PARA SACAR UN TOTAL DE VENTAS POR USUARIO
          for (let cd = 0; cd < newCreadores[ab].marcas.length; cd++){
            newCreadores[ab].total += newCreadores[ab].marcas[cd].puntosUsuario
          }
       }
       else if (dinamica.modalidad === "Puntos"){
         // PERO SI LA DINAMICA ES POR PUNTOS SACAMOS EL TOTAL DE PUNTOS DE CADA USUARIO
        for (let ef = 0; ef < newCreadores[ab].marcas.length; ef++){
          newCreadores[ab].total += newCreadores[ab].marcas[ef].puntosUsuario * newCreadores[ab].marcas[ef].puntosVentas
        }
       }
     }
     for(let ñ = 0; ñ < marcas.length; ñ++){
       //console.log(marcas[ñ]._id)
       for(let ññ = 0; ññ < newCreadores.length;ññ++){
         //console.log(newCreadores[ññ].ventasDinamica)
         for( let ñññ = 0; ñññ < newCreadores[ññ].ventasDinamica.length; ñññ++){
          if(marcas[ñ]._id === newCreadores[ññ].ventasDinamica[ñññ].id){
            marcas[ñ].total += newCreadores[ññ].ventasDinamica[ñññ].ventas
          }
         }
       }
     }
     // VENTAS TOTALES POR CENTRO DE CONSUMO
     for ( let s = 0; s < centros.length; s++){
       //console.log('CENTROS ID: ',centros[s]._id)
       for(let ss = 0; ss < newCreadores.length; ss++){
         //console.log('USERS CC ID: ',newCreadores[ss].centroConsumo)
         if(centros[s]._id === newCreadores[ss].centroConsumo){
           //console.log(centros[s],'    ',newCreadores[ss].ventasDinamica )
           for(let ig = 0; ig < newCreadores[ss].ventasDinamica.length; ig++){
            centros[s].ventasUsuario.push(newCreadores[ss].ventasDinamica[ig])
            //console.log(newCreadores[ss].ventasDinamica[ig])
           }
         }
       }
     }


     // TERMINA VT POR CC
      this.setState({newCreadores,dinamica, centros,marcas,ganadores}) 
      })
      .catch(e=>console.log(e))
      this.handleClose6()
    })
    .catch(e=>alert(e));
  }

  //ESTA ES LA FUNCION QUE NOS TRAE EL REPORTE COMPLETO, NO LE MANDAMOS FECHA, 
  //SOLO TRAEMOS TOOOODAS LAS EVIENCIAS APROBADAS QUE HA RECOLECTADO ESTA DINAMICA Y 
  //TRABAJAMOS A PARTIR DE ELLAS
  quieroReporteCompleto = () =>{
    let id = this.props.match.params.id
    getSingleDinamic(id)
    .then(dinamica=>{
        let {ganadores} = this.state;
        let marcas = dinamica.marcaPuntosVentas.map(marca=>marca._id);
        let { centros } = this.state;
      dinamica.fechaInicio = dinamica.fechaInicio.slice(0,10)
      dinamica.fechaFin = dinamica.fechaFin.slice(0,10)
      centros = dinamica.centroConsumo.map(centro=>centro);
      getEvidencesByDinamic(id)
      .then(evidencias=>{  
        //HACEMOS USO TAMBIEN AQUI DE ESTA FUNCION QUE LO QUE HACE ES SACARNOS LA LISTA DE USUARIOS UNICOS 
        this.usuariosUnicos(evidencias)  
        // HASTA AQUI YA TENEMOS A LOS USUARIOS Y SUS RESPECTIVAS EVIDENCIAS

        let {newCreadores} = this.state;

// AHORA QUEREMOS SUMAR SUS EVIDENCIAS RESPECTO A LA MARCA QUE VENDIERON, ES DECIR:
// SI VENDIERON EN UNA EVIDENCIA 20 COCAS Y DESPUES EN OTRA 3 COCAS, 
//QUEREMOS QUE SE IDENTIFIQUEN QUE SON VENTAS DEL MISMO PRODUCTO Y QUE SE SUMEN ( 20 + 3 ) = 23

// ESTOS CICLOS LO QUE HACEN ES DARLE LAS MARCAS QUE SE VENDIERON EN ESTA DINAMICA A CADA USUARIO:
      var lookupObject3  = {};
      for(let z = 0; z < newCreadores.length; z++){
        for(var ii in newCreadores[z].ventasDinamica) {
          lookupObject3[newCreadores[z].ventasDinamica[ii]['id']] = newCreadores[z].ventasDinamica[ii];
        }
        for(ii in lookupObject3) {
          newCreadores[z].marcas.push(lookupObject3[ii]);
       }
      }

      // AQUI SE ADENTRA A CADA USUARIO Y SE BUSCA:
      // SI SON MARCAS IGUALES QUE SE SUMEN SUS VENTAS 
     for(let x = 0; x < newCreadores.length; x++){
       for (let v = 0; v < newCreadores[x].marcas.length; v++){
          for ( let y = 0; y < newCreadores[x].ventasDinamica.length; y++){
            if(newCreadores[x].marcas[v]._id._id === newCreadores[x].ventasDinamica[y]._id._id  ){
              newCreadores[x].marcas[v].puntosUsuario += newCreadores[x].ventasDinamica[y].ventas
              newCreadores[x].marcas[v].nombre = newCreadores[x].ventasDinamica[y]._id.nombre
            }
          }
      }
     }
           // HASTA AQUI LOGRAMOS TENER YA A CADA USUARIO CON SUS VENTAS YA SUMADAS POR MARCA 


           // AQUI REVISAMOS SI EL USUARIO YA ES UN GANADOR 
     for (let ab = 0; ab < newCreadores.length; ab++){
       for( let g = 0; g < dinamica.ganadores.length; g++){
        if(dinamica.ganadores[g] === newCreadores[ab]._id){
          newCreadores[ab].ganador = true
          ganadores.push(newCreadores[ab])
        }
       }
       if(dinamica.modalidad === "Ventas"){
          // SI LA DINAMICA ES DE VENTAS; SUMAMOS SUS VENTAS PARA SACAR UN TOTAL DE VENTAS POR USUARIO
          for (let cd = 0; cd < newCreadores[ab].marcas.length; cd++){
            newCreadores[ab].total += newCreadores[ab].marcas[cd].puntosUsuario
          }
       }
       else if (dinamica.modalidad === "Puntos"){
         // PERO SI LA DINAMICA ES POR PUNTOS SACAMOS EL TOTAL DE PUNTOS DE CADA USUARIO
        for (let ef = 0; ef < newCreadores[ab].marcas.length; ef++){
          newCreadores[ab].total += newCreadores[ab].marcas[ef].puntosUsuario * newCreadores[ab].marcas[ef].puntosVentas
        }
       }
     }
     for(let ñ = 0; ñ < marcas.length; ñ++){
       //console.log(marcas[ñ]._id)
       for(let ññ = 0; ññ < newCreadores.length;ññ++){
         //console.log(newCreadores[ññ].ventasDinamica)
         for( let ñññ = 0; ñññ < newCreadores[ññ].ventasDinamica.length; ñññ++){
          if(marcas[ñ]._id === newCreadores[ññ].ventasDinamica[ñññ].id){
            marcas[ñ].total += newCreadores[ññ].ventasDinamica[ñññ].ventas
          }
         }
       }
     }
     // VENTAS TOTALES POR CENTRO DE CONSUMO
     for ( let s = 0; s < centros.length; s++){
       //console.log('CENTROS ID: ',centros[s]._id)
       for(let ss = 0; ss < newCreadores.length; ss++){
         //console.log('USERS CC ID: ',newCreadores[ss].centroConsumo)
         if(centros[s]._id === newCreadores[ss].centroConsumo){
           //console.log(centros[s],'    ',newCreadores[ss].ventasDinamica )
           for(let ig = 0; ig < newCreadores[ss].ventasDinamica.length; ig++){
            centros[s].ventasUsuario.push(newCreadores[ss].ventasDinamica[ig])
            //console.log(newCreadores[ss].ventasDinamica[ig])
           }
         }
       }
     }
     //console.log(newCreadores)
     // TERMINA VT POR CC
      this.setState({newCreadores,dinamica, centros,marcas,ganadores}) 
      })
      .catch(e=>console.log(e))
      this.handleClose6()
    })
    .catch(e=>alert(e));
  }
    // DEJA UNA LISTA DE USUARIOS QUE HAN PARTICIPADO EN ESTA DINAMICA
  usuariosUnicos = (evidencias) =>{
        // El array "creadoresArray" trae a todos los usarios que ya han hecho ventas en esta dinamica. 
        //Esta lista traera usuarios repetidos.
    let creadoresArray = evidencias.map(evidencia=>evidencia.creador)
    //Aqui guardaremos los usuarios unicos es decir ya no repetidos.
    var {newCreadores} = this.state;
    // No sabemos para que es pero es util, parece q aqui se guardan los que si estan repetidos...
    var lookupObject  = {};

    //Aqui comienzan los ciclos para dejar un array con usuarios unicos:

    for(var iii in creadoresArray) {
      lookupObject[creadoresArray[iii]['_id']] = creadoresArray[iii];
    }
    for(iii in lookupObject) {
      newCreadores.push(lookupObject[iii]);
   }
   // HASTA AQUI YA TENEMOS A LOS USUARIOS QUE NO SE REPITEN ES DECIR UNICOS ----> "newCreadores"

   // LE MANDA A LA FUNCION EVIDENCIAS POR USUARIO, LOS USUARIOS Y LAS EVIDENCIAS PARA QUE ESTA TRABAJE CON ELLOS
   this.evidenciasPorUsuario(newCreadores,evidencias)
  }

  // ESTA FUNCION ACOMODA LAS EVIDENCIAS POR USUARIO, 
  // ES DECIR SI LE PERTENECE UNA EVIDENCIA A TAL USUARIO PUE SPUM SE LA INSERTA A ESTE
  evidenciasPorUsuario = (newCreadores,evidencias) =>{
           // AQUI ACOMODAMOS LAS EVIDENCIAS CONFORME A QUE USUARIO PERTENECEN.
           for(var i = 0; i<newCreadores.length;i++){
            for(var j = 0; j<evidencias.length;j++){
              if( newCreadores[i]._id === evidencias[j].creador._id ){
                for ( let o = 0; o < evidencias[j].marcas.length; o++){
                  evidencias[j].marcas[o].id = evidencias[j].marcas[o]._id._id;
                  newCreadores[i].ventasDinamica.push(evidencias[j].marcas[o]);
                }
              }
            }
          }    
  }

  // ABRIR Y CERRAR DIALOGOS INFORMATIVOS O DETALLES DE VENTA DE USUARIO O DE CENTRO DE CONSUMO O DE MARCA
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  handleOpen2 = (detalleCreador) => {
    this.setState({open2: true,posibleGanador:detalleCreador});
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
    this.cerosTotal(this.state.newMarcas)
    this.setState({open4: false,newMarcas:[]});
  };
  handleOpen5 = () => {
    this.setState({open5: true});
  };
  handleClose5 = () => {
    this.setState({open5: false,detalleCreador:{},marcasGanador:{}});
  };
  handleOpen6 = () => {
    this.setState({open6: true});
  };
  handleClose6 = () => {
    this.setState({open6: false});
  };

  // SE USA PARA DETERMINAR LA FECHA DE INICIO DEL REPORTE SI ES QUE SE QUIERE UN REPORTE POR FECHA
  handleChange = (event, date) => {
    const {newObj} = this.state;
    newObj.fecha = date;
    this.setState({newObj});
  };

  // SE USA PARA DETERMINAR LA FECHA DE FIN DEL REPORTE SI ES QUE SE QUIERE UN REPORTE POR FECHA
  handleChange2 = (event, date) => {
    const {newObj2} = this.state;
    newObj2.fecha = date;
    this.setState({newObj2,botonFecha:false});
  };

  // SE USA PARA MOSTRAR EL DETALLE DE VENTA DE CADA PARTICIPANTE DE ESTA DINAMICA
  // SE USA UN SERVICIO PARA SABER A QUE CENTRO DE CONSUMO PERTENECE 
  detalleVenta = (creador) => {
    let id = creador.centroConsumo
    let {detalleCreador,marcasCreador} = this.state;
    getCenter(id)
    .then(center=>{
      this.handleOpen()
      detalleCreador = creador;
      marcasCreador = creador.marcas;
      detalleCreador.centro = center.nombre
      this.setState({detalleCreador,marcasCreador})
    })
    .catch(e=>console.log(e))
  } 

  // SE USA PARA MOSTRAR EL DETALLE DE UN GANADOR, ESTO SOLO SE USA EN REPORTES DONDE LA DINAMICA SEA DE MODALIDAD VENTAS
  detalleGanador = (ganador) => {
    this.handleOpen5()
    let {detalleGanador,marcasGanador} = this.state;
    detalleGanador = ganador;
    marcasGanador = ganador.marcas;
    this.setState({detalleGanador,marcasGanador})
  } 

  // SE USA PARA VER LAS VENTAS TOTALES DE DETERMINADA MARCA 
  // ABRE UN DIALOGO EN DONDE SE REPRESENTA LA INFO
  marcas = (marca) =>{
    this.handleOpen3()
    let {marcaVentas} = this.state;
    marcaVentas = marca
    this.setState({marcaVentas})
  }

  // SE USA PARA VER LAS VENTAS TOTALES POR DETERMINADO CENTRO DE CONSUMO, 
  //ESTO FUE MAS DIFICIL QUE LO DE LAS MARCAS PORQUE SE TUVIERON QUE EMPLEAR VARIOS LOOPS
  // Y AGRUPAR DISTINTOS ELEMENTOS POR CENTRO DE CONSUMO
  centros = (centro) =>{
    let {newMarcas} = this.state;
    let {centroDetalle} = this.state;
    let ventas = centro.ventasUsuario
    centroDetalle = centro
        //El array "marcas" trae a todas las marcas. 
        //Esta lista traera marcas repetidas.
        let marcas = centro.ventasUsuario.map(ventas=>ventas._id)

        // No sabemos para que es pero es util, parece q aqui se guardan las marcas que si estan repetidos...
        var lookupObject  = {};

        //Aqui comienzan los ciclos para dejar un array con marcas unicas:

        for(var iii in marcas) {
          lookupObject[marcas[iii]['_id']] = marcas[iii];
        }
        for(iii in lookupObject) {
          newMarcas.push(lookupObject[iii]);
       }
       // HASTA AQUI YA TENEMOS A LaS marcas QUE NO SE REPITEN ES DECIR UNICaS ----> "newMarcas"
       //console.log('MARCAS:   ',newMarcas)
       //console.log('VENTAS:   ',ventas)
       for ( let io = 0; io < newMarcas.length; io++){
         for( let ioi = 0; ioi < ventas.length; ioi++){
           if( newMarcas[io]._id === ventas[ioi].id ){
            newMarcas[io].total += ventas[ioi].ventas
           }
         }
       }
       this.handleOpen4()
       this.setState({newMarcas,centroDetalle,centro})
  }

  // ESTA FUNCION ES IMPORTANTE PORQUE HACE QUE LAS MARCAS REGRESEN A CERO, SINO 
  //TUVIERAMOS ESTA FUNCION NUESTRAS MARCAS SUMARIAN LAS VENTAS UNA Y OTRA Y OTRA VEZ
  cerosTotal = (newMarcas) => {
    for ( let ceros = 0; ceros < newMarcas.length; ceros++){
      newMarcas[ceros].total = 0
    }
    this.setState({newMarcas})
  }
  // EN ESTA FUNCION HAY QUE SEGUIR TRABAJANDO PERO SOLO ESTA DISPONIBLE CUANDO LA DINAMICA ES DE VENTAS
  // LO QUE HACE ES QUE SI UN USUARIO HA TENIDO UN BUEN RENDIMIENTO LO PUEDES CONVERTIR EN GANADOR
  enviarGanador = (ganador) => {
    let idDinamica = this.state.dinamica._id;
    //dinamic.winner = `${JSON.parse(localStorage.getItem('user'))._id}`;
    makeWinner(ganador,idDinamica)
    .then(dinamic=>{
    })
    .catch(e=>console.log(e))
    this.handleClose2()
  } 

  // REFRESCAMOS LA PAGINA PARA VOLVER  A CARGAR EL COMPONENTE Y 
  // LE DE LA OPCION A NUESTRO USUARIO DASHBOARD DE CAMBIAR LA 
  //VISUALIZACIÓN DEL REPORTE YA SEA POR FECHA O POR REPORTE COMPLETO
  refresh = () =>{
    window.location.reload()
  }

  render(){
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    const actions2 = [
      <FlatButton
        label="Cancelar acción"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose2}
      />,
      <FlatButton
        label="Continuar"
        primary={true}
        onClick={() => this.enviarGanador(this.state.posibleGanador)}
      />,
    ];
    const actions3 = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose3}
      />,
    ];
    const actions4 = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose4}
      />,
    ];
    const actions5 = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose5}
      />,
    ];
    const actions6 = [
      <FlatButton
        label="ENVIAR FECHA"
        primary={true}
        keyboardFocused={false}
        onClick={this.quieroFecha}
        disabled={this.state.botonFecha}
      />,
      <FlatButton
        label="REPORTE COMPLETO"
        primary={true}
        keyboardFocused={true}
        onClick={this.quieroReporteCompleto}
      />
    ];
    const {dinamica,centros,marcas,newCreadores,detalleCreador,marcasCreador,marcaVentas,newMarcas,centroDetalle,ganadores,detalleGanador,marcasGanador} = this.state;
      return (
        <div>
          <Dash/>
          <div className="padreDetail">
          <Paper style={style} >
          <RaisedButton labelColor="#FAFAFA" backgroundColor="#37474F" label="REPORTE DE DINÁMICA" fullWidth={true} />
          <br/> <br/>
          <div className="padreDetail">
            <div>
            <img alt="Imagen Premio" className="imgReporteResponsive" src={dinamica.imagenPremio}/>
            <br/><br/><br/><br/>
            <div>  
            <RaisedButton
              label="FECHA / COMPLETO"
              labelColor="#FAFAFA"
              backgroundColor="#607D8B"
              onClick={this.refresh}
            />
            </div>
            </div>
            <div className="datosReporteResponsive">
            <b>Nombre de la Dinámica:</b>
            <h3>{dinamica.nombreDinamica}</h3>
            <b>Descripción:</b>
            <h6>{dinamica.descripcion}</h6>
            <b>Modalidad de la Dinámica:</b>
            <br/>
            <span className="b">{dinamica.modalidad}</span>
            <br/><br/>
            <b>Tiempo de Duración:</b>
            <br/>
            <b>{dinamica.fechaInicio}</b>/<b>{dinamica.fechaFin}</b>
            <br/>
            <div className="centrarReporteDetailResponsive">
              <h4>Centros de Consumo:</h4>
              <div className="padreDetailReporteDetail" style={styles.wrapper} >
              {centros.map( (centro, index) => (
                <div key={index} >
              <Chip
              key={index}
              style={styles.chip}
              //className="reportDinamicDetailHijo"
              onClick={() => this.centros(centro)}
              >
                {centro.nombre}
              </Chip> 
              </div>
              ))}
              </div>
              <h4>Marcas:</h4>
              <div style={styles.wrapper}>
              {marcas.map( (marca, index) => (
                <div  key={index}>
              <Chip
              style={styles.chip}
              key={index}
              onClick={() => this.marcas(marca)}
              >
              <Avatar src={marca.imagen} />
                {marca.nombre}
              </Chip> 
                </div>
              ))}
              </div> 
            </div>  
            </div>  
          </div>
          <hr/>
          <div className="padreDetail">
              <h2> Ranking: </h2>
          </div>
          <div style={styles.root}>
    <GridList style={styles.gridList} cols={1} padding={4}>
      {newCreadores.sort((a, b) => b.total - a.total ).map((creador,index) => (
        <GridTile
          key={index}
          title={dinamica.modalidad === "Ventas" ? creador.total +' ventas' : creador.total + ' puntos'}
          subtitle={ creador.nombre && creador.apellido ? index+1 + ') ' + creador.nombre + " " + creador.apellido : index+1 + ') ' + creador.correo  }
          titleStyle={styles.titleStyle}
          onClick={() => this.detalleVenta(creador)}
          titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
        >
          <img width="180px" alt="Foto Usuario" src={creador.fotoPerfil ? creador.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Fuser.png?alt=media&token=f699f557-33b4-44d2-9de5-442e791b746a"} />
        </GridTile>
      ))}
    </GridList>
  </div>
  <hr/>

  <div className="padreDetail">
              <h2> Ganadores: </h2>
          </div>
          <div style={styles.root}>
    <GridList style={styles.gridList} cols={1}>
      {ganadores.sort((a, b) => b.total - a.total ).map((ganador,index) => (
        <GridTile
          key={ganador.fotoPerfil}
          title={ganador.total+' ventas'}
          subtitle={ganador.nombre && ganador.apellido ? index+1 + ') ' + ganador.nombre+' '+ganador.apellido : ganador.correo}
          titleStyle={styles.titleStyle}
          actionIcon={<IconButton onClick={() => this.detalleGanador(ganador)} ><FontIcon color="white" className="material-icons">equalizer</FontIcon></IconButton>}
          titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
        >
          <img alt="Foto Usuario" src={ganador.fotoPerfil} />
        </GridTile>
      ))}
    </GridList>
  </div>
          </Paper>
          </div>
          <div>
          <Dialog
          title="Detalle de Vendedor"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <img alt="Foto Usuario" width="300px" height="250px" src={detalleCreador.fotoPerfil ? detalleCreador.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Fuser.png?alt=media&token=f699f557-33b4-44d2-9de5-442e791b746a"} />
        <h2>{detalleCreador.centro}</h2>
        <h2>{detalleCreador.nombre && detalleCreador.apellido ? detalleCreador.nombre + " " + detalleCreador.apellido : ""}</h2>
        <h3>{detalleCreador.correo}</h3>
        <b className="bDetalleCreador">{detalleCreador.ganador === true  ? "Este usuario HA CUMPLIDO con las metas de esta dinámica" : (dinamica.modalidad === "Ventas" ? "Este usuario AÚN NO cumple con las metas de esta dinámica.": "Esta es una dinámica de modalidad Puntos")}</b>
        <br/><br/>
        {marcasCreador.map( (marca, index) => (
              <div key={index}>
              <Chip
              >
              <Avatar src={marca._id.imagen} />
                <span>{marca._id.nombre} </span> 
                 <b>{dinamica.modalidad === "Ventas" ?  marca.puntosUsuario + " ventas /  " + marca.puntosVentas + " meta" :  marca.puntosUsuario + " ventas  /  " + marca.puntosVentas + " puntos por Venta" }</b> 
              </Chip> 
              <br/><br/>
              </div>
              ))}
              <b>{dinamica.modalidad === "Ventas" ? "Ventas totales: " + detalleCreador.total : "Puntos Totales: " + detalleCreador.total}</b>
              <br/><br/>
              <FlatButton style={dinamica.modalidad === "Ventas" ? {display:"block"} : {display:"none"}} onClick={() => this.handleOpen2(detalleCreador)} backgroundColor="#BDBDBD" label="Convertir en Ganador" />

        </Dialog>
          </div>
          <div>
          <div>
            <Dialog
              title="¿Estás seguro?"
              actions={actions2}
              modal={false}
              open={this.state.open2}
              onRequestClose={this.handleClose2}
            >
              Esta acción solo debe de efectuarse cuando el rendimiento del usuario es 
              muy bueno, a pesar de no haber cumplido con las metas de la dinámica.
              <br/><br/>
              <b>¿Estás seguro de querer continuar con esta acción?</b>
            </Dialog>
      </div>
      <div>
            <Dialog
              title="Detalle de Venta por Marca"
              actions={actions3}
              modal={false}
              open={this.state.open3}
              autoScrollBodyContent={true}
              onRequestClose={this.handleClose3}
            >
              <img alt="Imagen Marca" width="200px" height="150px" src={marcaVentas.imagen} />
              <h4>{'Marca: ' + marcaVentas.nombre}</h4>
              <h4>{'Total de ventas en esta dinámica: '+marcaVentas.total}</h4>

            </Dialog>
      </div>
      <div>
            <Dialog
              title={"Detalle de Venta de "+ centroDetalle.nombre}
              actions={actions4}
              modal={false}
              open={this.state.open4}
              autoScrollBodyContent={true}
              onRequestClose={this.handleClose4}
            >
              <div>
              {newMarcas.map( (marca, index) => (
                <div className="chipCentroReporte" key={index} >
              <Chip
              key={index}
              >
              <Avatar src={marca.imagen} />
                {marca.nombre+'   '}
                <b>{marca.total+' unidades vendidas'}</b>
              </Chip> 
                </div>
              ))}
              </div> 

            </Dialog>
      </div>
      <div>
          <Dialog
          title="Detalle de Ganador"
          actions={actions5}
          modal={false}
          open={this.state.open5}
          onRequestClose={this.handleClose5}
          autoScrollBodyContent={true}
        >
        <img alt="Foto usuario" width="300px" height="250px" src={detalleCreador.fotoPerfil ? detalleCreador.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Fuser.png?alt=media&token=f699f557-33b4-44d2-9de5-442e791b746a"} />
        <h2>{detalleCreador.nombre && detalleCreador.apellido ? detalleCreador.nombre + " " + detalleCreador.apellido : ""}</h2>
        <h3>{detalleGanador.correo}</h3>
        <br/><br/>
        {marcasGanador.map( (marca, index) => (
              <div key={index}>
              <Chip
              >
              <Avatar src={marca._id.imagen} />
                <span>{marca._id.nombre} </span>
                 <b>{dinamica.modalidad === "Ventas" ? marca.puntosUsuario + " ventas  /  " + marca.puntosVentas + " meta" :  marca.puntosUsuario + " ventas  /  " + marca.puntosVentas + " puntos por Venta" }</b> 
              </Chip> 
              <br/><br/>
              </div>
              ))}
              <b>Ventas totales: {detalleGanador.total}</b>
              <br/>

        </Dialog>
          </div>
          <div>
          <Dialog
          title="¿Cómo deseas visualizar el reporte?"
          actions={actions6}
          modal={false}
          open={this.state.open6}
          autoScrollBodyContent={true}
          contentStyle={customContentStyle}
        >
        <b>Si deseas ver el reporte de ventas por DETERMINADA FECHA, por favor define la <span>Fecha Inicial</span> y la <span>Fecha Final</span> de búsqueda y presiona la opción ' ENVIAR FECHA '</b>
        <br/><br/>
        <div>
            <div>
            <DatePicker
            hintText="Fecha Inicial"
            value={this.state.newObj.fecha}
            onChange={this.handleChange}
            errorText="Define la fecha inicial de búsqueda"
            errorStyle={styles.errorStyle}
            autoOk={true}
            container="inline"
          /> 
            </div>
            <br/>
            <div>
          <DatePicker
            hintText="Fecha Final"
            value={this.state.newObj2.fecha}
            onChange={this.handleChange2}
            errorText="Define la fecha final de búsqueda"
            errorStyle={styles.errorStyle}
            autoOk={true}
            container="inline"
          />
          </div>
          </div> 
          <br/><br/>
        <b>De lo contrario presiona la opción ' REPORTE COMPLETO '</b>
      
        </Dialog>
          </div>
          </div>
        </div>
      );
    }
    
  }

  

export default DinamicaDetail;