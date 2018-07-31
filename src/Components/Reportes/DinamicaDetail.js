import React, {Component} from 'react';
import { getSingleDinamic } from '../../Services/dinamicas';
import { getEvidencesByDinamic } from '../../Services/evidencias';
import Dash from '../Dash/Dashboard';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
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
    marcas:[]
  }

  componentWillMount(){
     let id = this.props.match.params.id
    getSingleDinamic(id)
    .then(dinamica=>{
      let { centros } = this.state;
      let { marcas } = this.state;
      centros = dinamica.centroConsumo.map(centro=>centro);
      marcas = dinamica.marcas.map(marca=>marca);
      getEvidencesByDinamic(id)
      .then(evidencias=>{
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
            newCreadores[i].total = newCreadores[i].total + evidencias[j].cantidadProducto;
          }
        }
      }
        this.setState({newCreadores,evidencias})
      })
      .catch(e=>console.log(e))
      this.setState({dinamica, centros,marcas})
      console.log('DINAMICA:',this.state.dinamica,'------','RANKING:',this.state.newCreadores.sort((a, b) => b.total - a.total ))
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