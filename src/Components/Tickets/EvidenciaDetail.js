import React, {Component} from 'react';
import { getSingleEvidence,sendEvidencia } from '../../Services/evidencias';
import Dash from '../Dash/Dashboard';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import './evidencias.css';

const style = {
  height: '100%',
  width: '80%',
  margin: 20,
  textAlign: 'center',
  display: 'inline-block'
};
const style2 = {
  margin: 12,
};

class EvidenciaDetail extends Component{

  state={
    evidence:{},
    evidencia:{},
    value:null,
    textFieldDisabled:true
  }

  componentWillMount(){
     let id = this.props.match.params.id
    getSingleEvidence(id)
    .then(evidence=>{
      let { evidencia } = this.state;
      evidencia = evidence;
      evidence.dueño = evidence.creador.nombre +' '+ evidence.creador.apellido;
      evidence.fecha = evidence.created_at.slice(0,10);
      evidence.hora = evidence.created_at.slice(11,19);
      evidence.correo = evidence.creador.correo;
      evidence.descripcion = evidence.dinamica.descripcion
      this.setState({evidence,evidencia})
    })
    .catch(e=>alert(e));
  }
  handleChange = (event, index, value) => {
    if( value === "Desaprobada")
      {
        let {evidencia} = this.state;
        evidencia.status = value
        this.setState({textFieldDisabled:false,evidencia,value})
      }
      else if ( value === "Aprobada")
      {
        let {evidencia} = this.state;
        evidencia.status = value
        this.setState({textFieldDisabled:true,evidencia,value})
      }
  };
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {evidencia} = this.state;
    evidencia[field] = value;
    console.log(evidencia);
    this.setState({evidencia});
  }
  sendEvidence = (e) => {
    let { evidencia } = this.state;
    let id = this.props.match.params.id
    evidencia.dueño = null;
    evidencia.fecha = null;
    evidencia.hora = null;
    evidencia.correo = null;
    evidencia.descripcion = null;
    sendEvidencia(evidencia,id)
    .then(evidencia=>{
      this.props.history.push('/tickets');
    })
    .catch(e=>console.log(e))
  }

  render(){
    const {evidence} = this.state;
      return (
        <div>
          <Dash/>
          <div className="padreDetail">
          <Paper style={style} >
          <RaisedButton labelColor="#FAFAFA" backgroundColor="#37474F" label="DETALLE DE EVIDENCIA" fullWidth={true} />
            <div className="padreDetail">
            <div>
            <img src={evidence.archivo}/>
            <div>
              <div className="padreDetail">
              <SelectField
              floatingLabelStyle={{fontSize:25}}
              floatingLabelText="Acción"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <MenuItem value="Aprobada" primaryText="Aprobada" />
              <MenuItem value="Desaprobada" primaryText="Desaprobada" />
            </SelectField>
            <TextField
            floatingLabelStyle={{fontSize:15}}
            hintText="¿Explicale porqué?"
            floatingLabelText="¿Desaprobada?"
            name="nota"
            type="text"
            onChange={this.onChange}
            disabled={this.state.textFieldDisabled}
          />
              </div>
            </div>
            <div>
            <RaisedButton
              backgroundColor="#a4c639"
              icon={<FontIcon color="white" className="material-icons">gavel</FontIcon>}
              style={style2}
              onClick={this.sendEvidence}
            />
            </div>
            </div>
            <div className="hijoDetail">
           <u>Mensaje del Usuario: </u><h4>{evidence.mensaje}</h4>
            <u>Cantidad Vendida: </u><h4>{evidence.cantidadProducto}</h4>
            <u>Requerimientos de la dinámica: </u><h4>{evidence.descripcion}</h4>        
            <u>Modalidad: </u><b>{evidence.modalidad}</b>
            <br/><br/>        
            <u>Fecha: </u><b>{evidence.fecha}</b>
            <br/><br/>        
            <u>Hora: </u><b>{evidence.hora}</b>
            <br/><br/>        
            <u>Usuario: </u><b>{evidence.dueño}</b> 
            <br/><br/>        
            <u>Correo del Usuario: </u><b>{evidence.correo}</b>                                               
            </div>
            </div>
          </Paper>
          </div>
        </div>
      );
    }
    
  }

  

export default EvidenciaDetail;