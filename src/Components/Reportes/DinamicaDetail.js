import React, {Component} from 'react';
import { getSingleDinamic } from '../../Services/dinamicas';
import { getEvidencesByDinamic } from '../../Services/evidencias';
import Dash from '../Dash/Dashboard';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
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
};

class DinamicaDetail extends Component{

  state={
    dinamica:{},
    newCreadores:[],
    evidencias:[],
    centros:[],
    marcas:[],
    metaDinamica:[]
  }

  componentWillMount(){
     let id = this.props.match.params.id
    getSingleDinamic(id)
    .then(dinamica=>{
      //console.log(dinamica)
      let {metaDinamica} = this.state;
      let { centros } = this.state;
      metaDinamica = dinamica.marcaPuntosVentas;
      centros = dinamica.centroConsumo.map(centro=>centro);
      this.setState({dinamica, centros,metaDinamica})
      //console.log('DINAMICA:',this.state.dinamica,'------','RANKING:',this.state.newCreadores.sort((a, b) => b.total - a.total ))
      getEvidencesByDinamic(id)
      .then(evidencias=>{
        //console.log(evidencias.map(evidencia=>evidencia.marcas))
        let marcas = evidencias.map(evidencia=>evidencia.marcas);
        //console.log(evidencias.map(evidencia=>evidencia.creador._id))
        let creadoresArray = evidencias.map(evidencia=>evidencia.creador)
        var {newCreadores} = this.state;
        var lookupObject  = {};
        for(var i in creadoresArray) {
          lookupObject[creadoresArray[i]['_id']] = creadoresArray[i];
        }
        for(i in lookupObject) {
          newCreadores.push(lookupObject[i]);
       }
       //console.log(newCreadores)
       // hasta aqui va bien newCreadores trae todos los participantes de 
       //la dinamica sin repetirse.
       for(var i = 0; i<newCreadores.length;i++){
         //newCreadores[i].marcas = this.state.metaDinamica;
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
        //console.log(newCreadores[z].ventasDinamica)
        for(var i in newCreadores[z].ventasDinamica) {
          lookupObject3[newCreadores[z].ventasDinamica[i]['id']] = newCreadores[z].ventasDinamica[i];
        }
        for(i in lookupObject3) {
          newCreadores[z].marcas.push(lookupObject3[i]);
       }
      }



      // let metasDinamica;
      // let metasNoRepetidas = [];
      //   var lookupObject2 = {};
      // for( let x = 0; x < 1; x++){
      //    metasDinamica = newCreadores[x].ventasDinamica;
      // }

    //   for(var i in metasDinamica) {
    //     lookupObject2[metasDinamica[i]['id']] = metasDinamica[i];
    //   }
    //   for(i in lookupObject2) {
    //     metasNoRepetidas.push(lookupObject2[i]);
    //  }
     //console.log(metasNoRepetidas)

     for(let x = 0; x < newCreadores.length; x++){
       //console.log(newCreadores[x])
       for (let v = 0; v < newCreadores[x].marcas.length; v++){
        //console.log(newCreadores[x].marcas[v])
          //console.log(newCreadores[x].marcas[v][r].puntosVentas)
          for ( let y = 0; y < newCreadores[x].ventasDinamica.length; y++){
            //console.log(newCreadores[x].ventasDinamica[y]._id._id)
            if(newCreadores[x].marcas[v]._id._id === newCreadores[x].ventasDinamica[y]._id._id  ){
              newCreadores[x].marcas[v].puntosUsuario += newCreadores[x].ventasDinamica[y].ventas
              newCreadores[x].marcas[v].nombre = newCreadores[x].ventasDinamica[y]._id.nombre
            }
          }
      }
     }
     for (let ab = 0; ab < newCreadores.length; ab++){
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
  

  render(){
    const {dinamica} = this.state;
    const {centros} = this.state;
    const {marcas} = this.state;
    const {newCreadores} = this.state;
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
          titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
        >
          <img src={creador.fotoPerfil} />
        </GridTile>
      ))}
    </GridList>
  </div>
          </Paper>
          </div>
        </div>
      );
    }
    
  }

  

export default DinamicaDetail;