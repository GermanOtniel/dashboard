import React, {Component} from 'react';
import { getSingleEvidence,sendEvidencia } from '../../Services/evidencias';
import Dash from '../Dash/Dashboard';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
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
const styles = {
  chip: {
    margin: 1,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

class EvidenciaDetail extends Component{

  state={
    evidence:{},
    evidencia:{},
    marcas:[],
    value:null,
    textFieldDisabled:true,
    boton: false
  }

  componentWillMount(){
     let id = this.props.match.params.id
    getSingleEvidence(id)
    .then(evidence=>{
      let marcas = evidence.marcas.map(marca=>marca);
      let { evidencia } = this.state;
      evidencia = evidence;
      evidence.dueño = evidence.creador.nombre +' '+ evidence.creador.apellido;
      evidence.fecha2 = evidence.created_at.slice(0,10);
      evidence.hora = evidence.created_at.slice(11,19);
      let año = evidence.created_at.slice(0,4);
      let mes = evidence.created_at.slice(5,7)
      let dia = evidence.created_at.slice(8,10)
      let hora = evidence.created_at.slice(11,13)
      let min = evidence.created_at.slice(14,16)
      let seg = evidence.created_at.slice(17,19)
      let fechaChida = new Date(año,mes - 1,dia,hora - 5 ,min,seg)
      evidence.fechaChida = String(fechaChida).slice(16,24)       
      evidence.correo = evidence.creador.correo;
      evidence.descripcion = evidence.dinamica.descripcion
      evidence.imagen = evidence.dinamica.imagen
      this.setState({evidence,evidencia,marcas})
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
    this.setState({evidencia});
  }
  sendEvidence = (e) => {
    let { evidencia } = this.state;
    let {boton} = this.state;
    let id = this.props.match.params.id
    evidencia.dueño = null;
    evidencia.hora = null;
    evidencia.correo = null;
    evidencia.descripcion = null;
    boton = true
    this.setState({boton})
    sendEvidencia(evidencia,id)
    .then(r=>{
      this.props.history.push('/tickets');
    })
    .catch(e=>console.log(e))
  }

  render(){
    const {evidence,marcas} = this.state;
      return (
        <div>
          <Dash/>
          <div className="padreDetail">
          <Paper style={style} >
          <RaisedButton labelColor="#FAFAFA" backgroundColor="#37474F" label="DETALLE DE EVIDENCIA" fullWidth={true} />
            <div className="padreDetail">
            <div>
            <img alt="Imagen de evidencia" className="imagenEvidenciaDetail" src={evidence.archivo ? evidence.archivo : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo15.jpg?alt=media&token=70b5662e-bdb4-4d88-9174-7731e6c94340"}/>
            <div>
            <br/> <br/>
            <b className="b">{evidence.imagen ? "Esta Dinámica SI requeria imagen como evidencia" : "Esta Dinámica NO requeria imagen como evidencia" }</b>
            </div>
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
           <u>Mensaje del Usuario: </u><h4>{evidence.mensaje ? evidence.mensaje : "El usuario decidio no enviar mensaje" }</h4>
            <u>Cantidad Vendida según Usuario: </u>
            <br/><br/>
            <div style={styles.wrapper} className="padreDetail">
            {marcas.map( (marca, index) => (
              <div  key={index}>
              <Chip
              style={styles.chip}
              >
              <Avatar  src={marca._id.imagen} />
                <span className="span">{marca._id.nombre+" "}</span>
                 <b className="b">{  marca.ventas + " "}</b> <span> Ventas</span>
              </Chip> 
              <br/>
              </div>
              ))}
            </div>


                   
            <u>Status: </u><b className="b">{evidence.status}</b>
            <br/><br/>
            <u>Fecha: </u><b>{evidence.fecha2}</b>
            <br/><br/>        
            <u>Hora: </u><b>{evidence.fechaChida}</b>
            <br/><br/>        
            <u>Usuario: </u><b>{evidence.dueño}</b> 
            <br/><br/>        
            <u>Correo del Usuario: </u><b>{evidence.correo}</b> 
            <br/><hr/>
            <u>Requerimientos de la dinámica: </u><h5>{evidence.descripcion}</h5>        
            <u>Modalidad: </u><b>{evidence.modalidad}</b>                                                 
            </div>
            </div>
          </Paper>
          </div>
        </div>
      );
    }
    
  }

  

export default EvidenciaDetail;