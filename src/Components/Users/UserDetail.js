import React, {Component} from 'react';
import Dash from '../Dash/Dashboard';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {green700,blue500} from 'material-ui/styles/colors';
import { getUser } from '../../Services/authDash';
import {editHabilitiesOfUser} from '../../Services/usuarios';
import FontIcon from 'material-ui/FontIcon';
import {GridList, GridTile} from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';

const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};

const style = {
  height: '100%',
  width: '80%',
  margin: 40,
  textAlign: 'center',
  display: 'inline-block'
};
const styleDocumentos = {
  height: '100%',
  width: '80%',
  margin: 10,
  display: 'inline-block'
};
const styles = {
 
  autoComplete: {
    display: 'block'
  },
  autoHidden: {
    display: 'none'
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  },
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
  underline:{
    width: '75%'
  }
};

class UserDetail extends Component{

  state={
    user:{},
    open:false,
    colaborativo:[],
    disciplinado:[],
    puntualidad:[],
    limpieza:[],
    documentos:[],
    open2:false,
    habilidades:{},
    open3:false,
    open4:false,
    open5:false,
    documento:{}
  }

  
  componentWillMount(){
     let id = this.props.match.params.id
    getUser(id)
    .then(user=>{
     let {colaborativo,disciplinado,puntualidad,limpieza,documentos} = this.state;
     let colaborativoNumber,disciplinadoNumber,puntualidadNumber,limpiezaNumber;
     let arrHabilities = user.habilidades
     let sumaColaborativo = 0
     let sumaLimpieza = 0
     let sumaPuntualidad = 0 
     let sumaDisciplinado = 0
     let lengthArrHab = arrHabilities.length;
     for(let j = 0; j < arrHabilities.length; j++){
       sumaColaborativo = sumaColaborativo + arrHabilities[j].colaborativo
       sumaLimpieza     = sumaLimpieza + arrHabilities[j].limpieza
       sumaDisciplinado = sumaDisciplinado + arrHabilities[j].disciplinado
       sumaPuntualidad  = sumaPuntualidad + arrHabilities[j].puntualidad
     }
     colaborativoNumber = Math.round(sumaColaborativo / lengthArrHab);
     disciplinadoNumber = Math.round(sumaDisciplinado / lengthArrHab);
     puntualidadNumber = Math.round(sumaPuntualidad / lengthArrHab);
     limpiezaNumber = Math.round(sumaLimpieza / lengthArrHab);
     if(colaborativoNumber > 0){
       for(let i = 0; i < colaborativoNumber; i++){
         colaborativo.push('star')
       }
     }
     if(disciplinadoNumber > 0){
      for(let i = 0; i < disciplinadoNumber; i++){
        disciplinado.push('star')
      }
    }
    if(puntualidadNumber > 0){
      for(let i = 0; i < puntualidadNumber; i++){
        puntualidad.push('star')
      }
    }
    if(limpiezaNumber > 0){
      for(let i = 0; i < limpiezaNumber; i++){
        limpieza.push('star')
      }
    }
    if(limpiezaNumber === 0 && puntualidadNumber === 0 && disciplinadoNumber === 0 && colaborativoNumber === 0){
      this.setState({open2:true})
    }
    documentos = [
      {
        nombre:"Identificación Oficial",
        imagen: user.documentos.idOficial,
        featured: true
      },
      {
        nombre:"Acta de Nacimiento",
        imagen:user.documentos.actaNac,
        featured: true
      },
      {
        nombre:"CURP",
        imagen:user.documentos.curp,
        featured:true
      }
    ]
      user.centrito = user.centroConsumo.nombre
      this.setState({user,documentos})
    })
    .catch(e=>alert(e));
  }

// ABRIR Y CERRAR DIALOGO PARA EDITAR UN USUARIO
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,habilidades:{}});
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
    this.setState({open5: false});
  };

  verArchivo=(d)=>{
    this.handleOpen5()
    this.setState({documento:d})
  }

  onChange=(e)=>{
    const field = e.target.name;
    const value = e.target.value;
    const {habilidades} = this.state;
    habilidades[field] = value;
    this.setState({habilidades}); 
  }

// ENVIAR LOS CAMBIOS A NUESTRO BACKEND MEDIANTE EL SERVICIO editUser 
  sendEdit = () => {
    const id = this.props.match.params.id;
    const {habilidades} = this.state;
    if(habilidades.puntualidad > 0 && habilidades.puntualidad <= 5 && habilidades.limpieza > 0 && habilidades.limpieza <= 5 && habilidades.disciplinado > 0 && habilidades.disciplinado <= 5 && habilidades.colaborativo > 0 && habilidades.colaborativo <= 5 ){
      editHabilitiesOfUser(id,habilidades)
      .then(r=>{
        window.location.reload()
      })
      .catch(e=>console.log(e)) 
    }
    else{
      this.setState({open3:true})
    }    
  }


  render(){
    const {user,colaborativo,limpieza,disciplinado,puntualidad,documentos,documento} = this.state;
    const actions = [
      <FlatButton 
      onClick={this.sendEdit}  
      label="Enviar Cambios" 
      primary={true}
      disabled={this.state.boton}
      />
    ]
    const actions2 = [
      <FlatButton 
      onClick={this.handleOpen}  
      label="Editar" 
      primary={true}
      />,
      <FlatButton 
      onClick={this.handleClose2}  
      label="Cerrar" 
      primary={true}
      />
    ];
    const actions3 = [
      <FlatButton 
      onClick={this.handleClose3}  
      label="Ok" 
      primary={true}
      />
    ]
    const actions4 = [
      <FlatButton 
      onClick={this.handleClose4}  
      label="Ok" 
      primary={true}
      />
    ]
    const actions5 = [
      <FlatButton 
      onClick={this.handleClose5}  
      label="Ok" 
      primary={true}
      />
    ]
      return (
        <div>
          <Dash/>
          <br/><br/><br/>
          <div className="userPadreDetail">
          <Paper style={style}>
          <RaisedButton onClick={this.handleOpen4} labelColor="#FAFAFA" backgroundColor="#37474F" label="DETALLE DE USUARIO" fullWidth={true} />
          <div className="userPadreDetail">
            <div>
            <img alt="Imagen Usuario" className="imagenUserDetailResponsive" src={user.fotoPerfil ? user.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Ffoto-no-disponible.jpg?alt=media&token=c8c0d7a0-d1f2-418a-89d1-9d7688d0e801"}/>
            </div>
            <div className="userSonDetailResponsive">
              <h4>Colaborativo: </h4>{colaborativo.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))}
              <br/>
              <h4>Limpieza: </h4>{limpieza.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))}
              <br/>
              <h4>Puntualidad: </h4>{puntualidad.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))} 
              <br/>
              <h4>Disciplinado: </h4>{disciplinado.map((estrellita,index)=>(
              <FontIcon key={index} style={{color:'#FFE53F'}} className="material-icons ">{estrellita}</FontIcon>
          ))}                                                                                        
            </div>
          </div>
          <RaisedButton   
                label="Editar" 
                backgroundColor="#0D47A1"
                labelColor="#FAFAFA" 
                onClick={this.handleOpen} 
              />
          </Paper>
          </div>
          <div className="userPadreDetail">
          <Paper style={styleDocumentos}>
          <div>
              <h2>Documentos: </h2>
              <hr/>
          </div>
          <div style={styles.root}>
          <GridList style={styles.gridList} cols={1} padding={4}>
            {documentos.map((documento,index) => (
              <GridTile
                key={index}
                title={documento.nombre}
                actionIcon={<FlatButton
                  label={<FontIcon style={{color:'white'}} className="material-icons">visibility</FontIcon>}
                  labelPosition="before"
                  style={styles.uploadButton}
                  onClick={()=>this.verArchivo(documento)}
                > 
                </FlatButton>}
                actionPosition="left"
                titleStyle={styles.titleStyle}
                titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
              >
                <img width="180px" alt="Foto Usuario" src={documento.imagen} />
              </GridTile>
            ))}
          </GridList>
          </div>
          </Paper>
          </div>
          <div>
          <Dialog
            title="Asignar calificaciones:"
            modal={false}
            actions={actions}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
           <TextField
              onInput={(e)=>{ 
                let unDigito = e.target.value 
                unDigito = Math.max(0, parseInt(e.target.value,6) ).toString().slice(0,1)
                e.target.value = Number(unDigito)
              }}
              min={1}
              max={5}
              onChange={this.onChange}
              name="limpieza"
              type="number"
              hintText="del 1-5"
              floatingLabelText="Limpieza"
              floatingLabelStyle={styles.floatingLabelFocusStyle}
              errorText="donde 1 es muy malo y 5 es muy bueno"
              errorStyle={styles.errorStyle} 
              underlineStyle={styles.underline}
           />
           <br/>
           <TextField
              onInput={(e)=>{ 
                let unDigito = e.target.value 
                unDigito = Math.max(0, parseInt(e.target.value,6) ).toString().slice(0,1)
                e.target.value = Number(unDigito)
              }}
              min={1}
              max={5}
              onChange={this.onChange}
              name="colaborativo"
              type="number"
              hintText="del 1-5"
              floatingLabelText="Colaborativo"
              floatingLabelStyle={styles.floatingLabelFocusStyle}
              errorText="donde 1 es muy malo y 5 es muy bueno"
              errorStyle={styles.errorStyle} 
              underlineStyle={styles.underline}
           />
           <br/>
           <TextField
              onInput={(e)=>{ 
                let unDigito = e.target.value 
                unDigito = Math.max(0, parseInt(e.target.value,6) ).toString().slice(0,1)
                e.target.value = Number(unDigito)
              }}
              min={1}
              max={5}
              onChange={this.onChange}
              name="puntualidad"
              type="number"
              hintText="del 1-5"
              floatingLabelText="Puntualidad"
              floatingLabelStyle={styles.floatingLabelFocusStyle}
              errorText="donde 1 es muy malo y 5 es muy bueno"
              errorStyle={styles.errorStyle} 
              underlineStyle={styles.underline}
           />
           <br/>
           <TextField
              onInput={(e)=>{ 
                let unDigito = e.target.value 
                unDigito = Math.max(0, parseInt(e.target.value,6) ).toString().slice(0,1)
                e.target.value = Number(unDigito)
              }}
              min={1}
              max={5}
              onChange={this.onChange}
              name="disciplinado"
              type="number"
              hintText="del 1-5"
              floatingLabelText="Disciplinado"
              floatingLabelStyle={styles.floatingLabelFocusStyle}
              errorText="donde 1 es muy malo y 5 es muy bueno"
              errorStyle={styles.errorStyle} 
              underlineStyle={styles.underline}
           />
        </Dialog> 
         </div>
         <div>
          <Dialog
            title="Información:"
            modal={false}
            actions={actions2}
            open={this.state.open2}
            onRequestClose={this.handleClose2}
            autoScrollBodyContent={true}
          >
            <b>¡Este usuario aún no tiene calificaciones!</b>
            <br/><br/>
            Asígnale sus calificaciones a este usuario, donde 1 es muy malo y 5 es muy bueno.
            <br/><br/>
            Puedes editarlas cuando quieras pero recuerda que el sistema saca un promedio de sus calificaciones.
          </Dialog> 
         </div>
         <div>
          <Dialog
            title="Error:"
            modal={false}
            actions={actions3}
            open={this.state.open3}
            onRequestClose={this.handleClose3}
            autoScrollBodyContent={true}
          >
            <b>Debes de rellenar todos los campos y las cantidades permitidas son del 1-5</b>
            
          </Dialog> 
         </div>
         <div>
          <Dialog
            title="Información adicional:"
            modal={false}
            actions={actions4}
            open={this.state.open4}
            onRequestClose={this.handleClose4}
            autoScrollBodyContent={true}
          >
            <b>Nombre del Usuario:</b><br/>
            <a>{user.nombre && user.apellido ? user.nombre + ' ' + user.apellido : "Usuario no registro nombre"}</a><br/><br/>
            <b>Correo electrónico:</b><br/>
            <a>{user.correo}</a><br/><br/>
            <b>Teléfono:</b><br/>
            <a>{user.telefono ? user.telefono : "El usuario no registró teléfono"}</a><br/><br/>
            <b>Venue:</b><br/>
            <a>{user.centrito}</a>
          </Dialog> 
         </div>
         <div>
          <Dialog
            modal={false}
            title={documento.nombre}
            actions={actions5}
            open={this.state.open5}
            onRequestClose={this.handleClose5}
            autoScrollBodyContent={true}
            contentStyle={customContentStyle}
          >
          <h3>Para descargar la imagen haz click derecho > Guardar imagen como, ó en su defecto pulsa la imagen 3 segundos y elige la opción Guardar Imagen.</h3>
          <div style={{textAlign:'center'}}>
            <img width="50%" height="40%" alt="Imagen Archivo" src={documento.imagen ? documento.imagen : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Fnoimagen.jpg?alt=media&token=ce3e9648-3740-465b-bc26-3318de70d4b0"} />            
          </div>
          </Dialog> 
         </div>
        </div>
      );
    }
  }

export default UserDetail;