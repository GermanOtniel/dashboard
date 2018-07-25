import React, {Component} from 'react';
import { getSingleEvidence,sendEvidencia } from '../../Services/evidencias';
import Dash from '../Dash/Dashboard';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import './evidencias.css';

const style = {
  height: '100%',
  width: '80%',
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};
const style2 = {
  margin: 12,
};

class EvidenciaDetail extends Component{

  state={
    evidence:{},
    evidencia:{},
    value:null
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
      this.setState({evidence,evidencia})
    })
    .catch(e=>alert(e));
  }
  handleChange = (event, index, value) => {
    let {evidencia} = this.state;
    evidencia.status = value
    this.setState({evidencia,value})
  };
  sendEvidence = (e) => {
    let { evidencia } = this.state;
    let id = this.props.match.params.id
    evidencia.dueño = null;
    evidencia.fecha = null;
    evidencia.hora = null;
    evidencia.correo = null;
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
            <div className="hijoDetail">
            <img src={evidence.archivo}/>
            <SelectField
              floatingLabelStyle={{fontSize:25}}
              floatingLabelText="Acción"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <MenuItem value="Aprobada" primaryText="Aprobada" />
              <MenuItem value="Desaprobada" primaryText="Desaprobada" />
            </SelectField>
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
           <u>Mensaje Adjunto: </u><h4>{evidence.mensaje}</h4>
            <u>Cantidad Vendida: </u><h4>{evidence.cantidadProducto}</h4>    
            <u>Modalidad: </u><h4>{evidence.modalidad}</h4>
            <u>Fecha: </u><h4>{evidence.fecha}</h4>
            <u>Hora: </u><h4>{evidence.hora}</h4>        
            <u>Usuario: </u><h4>{evidence.dueño}</h4> 
            <u>Correo del Usuario: </u><h4>{evidence.correo}</h4>                                               
            </div>
            </div>
          </Paper>
          </div>
        </div>
      );
    }
    
  }

  

export default EvidenciaDetail;