import React, {Component} from 'react';
import { getSingleEvidence,sendEvidencia } from '../../Services/evidencias';
import {getCenter} from '../../Services/centro';
import Dash from '../Dash/Dashboard';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

const style = {
  width: '100%',
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
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  dontSee: {
    display: 'none'
  }
};

class EvidenciaDetail extends Component{

  state={
    evidence:{},
    evidencia:{},
    marcas:[],
    value:null,
    textFieldDisabled:true,
    boton: false,
    botonGavel:true,
    dinamica:{},
    centro:{},
    open: false,
    marcaDetail:{}
  }

  // BUSCAMOS EL DETALLE DE CIERTA EVIDENCIA A TRAVES DEL SERVICIO getSingleEvidence
  componentWillMount(){
     let id = this.props.match.params.id
    getSingleEvidence(id)
    .then(evidence=>{
      let idCentro = evidence.creador.centroConsumo
      let marcas = evidence.marcas.map(marca=>marca);
      let marcasDescripcion = evidence.dinamica.marcaPuntosVentas;
      let { evidencia,dinamica } = this.state;
      evidencia = evidence;
      evidence.dueño        = evidence.creador.nombre +' '+ evidence.creador.apellido;
      evidence.telefono     = evidence.creador.telefono;
      evidence.fecha2       = evidence.created_at.slice(0,10);
      evidence.hora         = evidence.created_at.slice(11,19);
      let año               = evidence.created_at.slice(0,4);
      let mes               = evidence.created_at.slice(5,7)
      let dia               = evidence.created_at.slice(8,10)
      let hora              = evidence.created_at.slice(11,13)
      let min               = evidence.created_at.slice(14,16)
      let seg               = evidence.created_at.slice(17,19)
      let fechaChida        = new Date(año,mes - 1,dia,hora - 5 ,min,seg)
      evidence.fechaChida   = String(fechaChida).slice(16,24)       
      evidence.correo       = evidence.creador.correo;
      evidence.descripcion  = evidence.dinamica.descripcion
      evidence.imagen       = evidence.dinamica.imagen
      dinamica              = evidence.dinamica
      for(let i = 0; i < marcas.length; i++){
        for(let j = 0; j < marcasDescripcion.length; j++){
          if(marcas[i]._id._id === marcasDescripcion[j]._id){
            marcas[i].descripcion = marcasDescripcion[j].descripcion
          }
        }
      }
        getCenter(idCentro)
        .then(centro=>{
          this.setState({centro})
        })
        .catch(e=>{console.log(e)})
      this.setState({evidence,evidencia,marcas,dinamica})
    })
    .catch(e=>console.log(e));
  }

  // A TRAVES DE ESTA FUNCION SE APRUEBA O RECHAZA UNA EVIDENCIA, EN SI SOLO SE CAMBIA EL VALOR DE SU STATUS
  handleChange = (event, index, value) => {
    if( value === "Desaprobada")
      {
        let {evidencia} = this.state;
        evidencia.status = value
        this.setState({textFieldDisabled:false,evidencia,value,botonGavel:true})
      }
      else if ( value === "Aprobada")
      {
        let {evidencia} = this.state;
        evidencia.status = value
        this.setState({textFieldDisabled:true,evidencia,value,botonGavel:false})
      }
  };

  // SE VE MAS INFO DE UNA MARCA COMO LA DESCRIPCION
  handleOpen =(marca)=>{
    this.setState({open:true,marcaDetail:{
      descripcion:marca.descripcion,
      nombre: marca._id.nombre,
      imagen: marca._id.imagen
    }})
  }
  handleClose =()=>{
    this.setState({open:false})
  }
  // CUANDO SE RECHAZA UNA EVIDENCIA SE DA LA OPORTUNIDAD DE MANDAR UNA NOTA DE PORQUE SE RECHAZA
  // ESTE ES EL ONCHANGE QUE SE USA PARA GUARDAR EL MSJ DE ACLARACIÓN
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {evidencia} = this.state;
    if(field === "nota"){
      this.setState({botonGavel:false})
    }
    evidencia[field] = value;
    this.setState({evidencia});
  }

  // SE MANDA LA EVIDENCIA DE VUELTA, PARA CAMBIAR SU ESTATUS Y SI FUE APROBADA PUES PROCEDER A DAR SU
  // RECOMPENSA Y SI NO FUE APROBADA PUES MOSTRAR Y CREAR LA NOTA DE PORQUE FUE RECHAZADA
  sendEvidence = (e) => {
    let { evidencia,dinamica } = this.state;
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
      this.props.history.push(`/tickets/${dinamica._id}`);
    })
    .catch(e=>console.log(e))
  }

    // PARA IR A LA PAGINA ANTERIOR
    goBack =()=>{
      let {dinamica} = this.state;
      this.props.history.push(`/tickets/${dinamica._id}`)
    }

  render(){
    const {evidence,marcas,botonGavel,centro,marcaDetail} = this.state;
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    return (
      <div>
        <Dash/>
        <br/><br/><br/>
        <div>
          <Paper style={style}>
            <RaisedButton labelColor="#FAFAFA" backgroundColor="#37474F" label="DETALLE DE EVIDENCIA" fullWidth={true} />
              <div className="padreDetail">                             
                  <div>
                    <div>
                      <br/>
                      <img alt="Imagen de evidencia" className="imagenEvidenciaDetailResponsive" src={evidence.archivo ? evidence.archivo : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo15.jpg?alt=media&token=70b5662e-bdb4-4d88-9174-7731e6c94340"}/>
                      <br/>
                      <b style={{fontSize:'14px'}} className="bEvidenciaDetail">{evidence.imagen ? "Esta Dinámica SI requeria imagen como evidencia" : "Esta Dinámica NO requeria imagen como evidencia" }</b>
                      <br/>
                      <FlatButton onClick={this.goBack} label="Atrás" style={{backgroundColor:"#B71C1C",color:"white"}} />
                      <br/>
                    </div>
                    <div>
                      <div className="padreDetailEvidenciaResponsive">
                        <SelectField
                          floatingLabelStyle={{fontSize:20}}
                          floatingLabelText="Acción"
                          value={this.state.value}
                          onChange={this.handleChange}
                        >
                            <MenuItem value="Aprobada" primaryText="Aprobada" />
                            <MenuItem value="Desaprobada" primaryText="Desaprobada" />
                        </SelectField>
                        <TextField
                          hintText="desaprobaste su evidencia"
                          floatingLabelStyle={this.state.textFieldDisabled ? {color:'#E0E0E0',fontSize:12} : {color:'#a4c639',fontSize:15}}
                          floatingLabelText="Explicale porqué"
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
                        disabled={botonGavel}
                      />
                    </div>
                  </div>
                  <div  className="hijoDetailEvidenciasResponsive">
                    <u>Usuario: </u><b>{evidence.dueño ? evidence.dueño : evidence.correo}</b> 
                    <br/><br/> 
                    <u>Teléfono: </u><b>{evidence.telefono ? evidence.telefono : 's/n'}</b> 
                    <br/><br/> 
                    <u>Venue: </u><b>{centro.nombre}</b> 
                    <br/><br/> 
                    <u>Status: </u><b className="bEvidenciaDetail">{evidence.status}</b>
                    <br/><br/>
                    <u>Mensaje del Usuario: </u><h4>{evidence.mensaje ? evidence.mensaje : "El usuario decidio no enviar mensaje" }</h4>
                    <u>Cantidad Vendida según Usuario: </u>
                    <br/><br/>
                      <div style={styles.wrapper}>
                        {marcas.map( (marca, index) => (
                        <div  key={index}>
                        <Chip
                          style={marca.ventas !== 0 ? styles.chip : styles.dontSee}
                          onClick={()=>this.handleOpen(marca)}
                        >
                        <Avatar  src={marca._id.imagen} />
                          <div className="spanEvidenciaResponsive">
                            <span >{marca._id.nombre.length > 14 ? marca._id.nombre.slice(0,14)+" " : marca._id.nombre+" "}</span>
                            <b className="bEvidenciaDetail">{  marca.ventas + " "}</b> <span> Ventas</span>
                          </div>
                        </Chip> 
                        <br/>
                        </div>
                        ))}
                      </div> 
                    <u>Fecha: </u><b>{evidence.fecha2}</b>
                    <br/><br/>        
                    <u>Hora: </u><b>{evidence.fechaChida}</b>
                    <br/><br/>               
                    <u>Correo del Usuario: </u><b>{evidence.correo}</b> 
                    <br/><hr/>
                    <u>Requerimientos de la dinámica: </u><h5>{evidence.descripcion}</h5>        
                    <u>Modalidad: </u><b>{evidence.modalidad}</b>                                                 
                  
                  </div>
                    </div>
          </Paper>
        </div>
        <div>
          <Dialog
          title={"Detalle de " + marcaDetail.nombre}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        <img width="100px" src={marcaDetail.imagen} alt="Fotito Marcadetail"/>
        <p>{marcaDetail.descripcion}</p>
        </Dialog>
          </div>
      </div>
    );
    }
    
  }

  

export default EvidenciaDetail;