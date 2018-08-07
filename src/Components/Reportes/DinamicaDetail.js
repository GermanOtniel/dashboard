import React, {Component} from 'react';
import { getSingleDinamic } from '../../Services/dinamicas';
import { getEvidencesByDinamic } from '../../Services/evidencias';
import Dash from '../Dash/Dashboard';
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import './reportes.css';

const style = {
  height: '100%',
  width: '80%',
  margin: 20,
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
    detalleCreador: {},
    marcasCreador: []
  }

  componentWillMount(){
     let id = this.props.match.params.id
    getSingleDinamic(id)
    .then(dinamica=>{
      //console.log(dinamica)
        let marcas = dinamica.marcaPuntosVentas.map(marca=>marca._id);
        let { centros } = this.state;
      centros = dinamica.centroConsumo.map(centro=>centro);
      this.setState({dinamica, centros,marcas})
      getEvidencesByDinamic(id)
      .then(evidencias=>{
        // for(let ñ = 0; ñ < marcas.length; ñ++){
        //   console.log(marcas[ñ])
        // }
        let creadoresArray = evidencias.map(evidencia=>evidencia.creador)
        var {newCreadores} = this.state;
        var lookupObject  = {};
        for(var i in creadoresArray) {
          lookupObject[creadoresArray[i]['_id']] = creadoresArray[i];
        }
        for(i in lookupObject) {
          newCreadores.push(lookupObject[i]);
       }
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
      var lookupObject3  = {};
      for(let z = 0; z < newCreadores.length; z++){
        for(var i in newCreadores[z].ventasDinamica) {
          lookupObject3[newCreadores[z].ventasDinamica[i]['id']] = newCreadores[z].ventasDinamica[i];
        }
        for(i in lookupObject3) {
          newCreadores[z].marcas.push(lookupObject3[i]);
       }
      }
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
     for (let ab = 0; ab < newCreadores.length; ab++){
       for( let g = 0; g < dinamica.ganadores.length; g++){
        if(dinamica.ganadores[g] === newCreadores[ab]._id){
          newCreadores[ab].ganador = true
        }
       }
       for (let cd = 0; cd < newCreadores[ab].marcas.length; cd++){
          newCreadores[ab].total += newCreadores[ab].marcas[cd].puntosUsuario
       }
     }
     console.log(newCreadores)
      this.setState({newCreadores}) 
      })
      .catch(e=>console.log(e))
    })
    .catch(e=>alert(e));
    
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  detalleVenta = (creador) => {
    this.handleOpen()
    let {detalleCreador,marcasCreador} = this.state;
    detalleCreador = creador;
    marcasCreador = creador.marcas;
    this.setState({detalleCreador,marcasCreador})
   //console.log(detalleCreador,marcasCreador)
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
    const {dinamica,centros,marcas,newCreadores,detalleCreador,marcasCreador} = this.state;
      return (
        <div>
          <Dash/>
          <div className="padreDetail">
          <Paper style={style} >
          <RaisedButton labelColor="#FAFAFA" backgroundColor="#37474F" label="REPORTE DE DINÁMICA" fullWidth={true} />
          <br/> <br/>
          <div className="padreDetail">
        
            <div>
            <img className="img" src={dinamica.imagenPremio}/>
            </div>
            
            <div>
            <b>Nombre de la Dinámica:</b>
            <h3>{dinamica.nombreDinamica}</h3>
            <b>Descripción:</b>
            <h6>{dinamica.descripcion}</h6>
            <b>Modalidad de la Dinámica:</b>
            <p>{dinamica.modalidad}</p>
            <b>Tiempo de Duración:</b>
            <b>{dinamica.fechaInicio}</b>/<b>{dinamica.fechaFin}</b>
            <br/>
            <br/>
              <h4>Centros de Consumo:</h4>
              <div className="padreDetail" >
              {centros.map( (centro, index) => (
              <Chip
              key={index}
              className="reportDinamicDetailHijo"
              >
                {centro.nombre}
              </Chip> 
              ))}
              </div>
              <h4>Marcas:</h4>
              <div className="padreDetail" >
              {marcas.map( (marca, index) => (
              <Chip
              key={index}
              className="reportDinamicDetailHijo"
              >
              <Avatar src={marca.imagen} />
                {marca.nombre}
              </Chip> 
              ))}
              </div>    
            </div>  
          </div>
          <hr/>
          <div className="padreDetail">
              <h2> Ranking: </h2>
          </div>
          <div style={styles.root}>
    <GridList style={styles.gridList} cols={1}>
      {newCreadores.sort((a, b) => b.total - a.total ).map((creador,index) => (
        <GridTile
          key={creador.fotoPerfil}
          title={creador.total+' ventas'}
          subtitle={index+1 + ') ' + creador.nombre+' '+creador.apellido}
          titleStyle={styles.titleStyle}
          actionIcon={<IconButton onClick={() => this.detalleVenta(creador)} ><FontIcon color="white" className="material-icons">equalizer</FontIcon></IconButton>}
          titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
        >
          <img src={creador.fotoPerfil} />
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
        <img width="300px" height="250px" src={detalleCreador.fotoPerfil} />
        <h2>{detalleCreador.nombre + " " + detalleCreador.apellido}</h2>
        <h3>{detalleCreador.correo}</h3>
        <b className="bDetalleCreador">{detalleCreador.ganador === true ? "Este usuario HA CUMPLIDO con las metas de esta dinámica" : "Este usuario AÚN NO cumple con las metas de esta dinámica."}</b>
        <br/><br/>
        {marcasCreador.map( (marca, index) => (
              <div key={index}>
              <Chip
              className="dinamicDetailHijo"
              >
              <Avatar src={marca._id.imagen} />
                {marca._id.nombre}
                 <b>{" " + marca.puntosUsuario + " ventas" + "   /  " + marca.puntosVentas + " meta" }</b> 
              </Chip> 
              <br/><br/>
              </div>
              ))}
              <b>Ventas totales: {detalleCreador.total}</b>
        </Dialog>
          </div>
        </div>
      );
    }
    
  }

  

export default DinamicaDetail;