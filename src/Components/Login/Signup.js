import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import { signup } from '../../Services/authDash';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';



class Signup extends Component {

  state={
    user:{},
    open:false,
    boton:true,
    open2:false,
    mensajeContraseñas:"",
    infoIncompleta:true
  }
  // PARA GUARDAR LA INFO QUE EL USUARIO INGRESAPARA REGISTRARSE, 
  //EL USUARIO DEBE LLENAR TODOS LOS CAMPOS PARA QUE EL BOTON DE 
  //INGRESAR SE HABILITE Y PUEDA INGRESAR
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {user} = this.state;
    user[field] = value;
    user.correo = user.correo.toLowerCase();
    if(user.correo.includes('@') && user.correo.includes('.') ){
      this.setState({boton:false})
    }
    else if(!user.correo.includes('@') || !user.correo.includes('.') ){
      this.setState({boton:true,infoIncompleta:true})
    }
    this.setState({user});
  }
//REVISA QUE LAS CONTRASEÑAS COINCIDAN 
  onChangeContraseñas = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {user} = this.state;
    let {mensajeContraseñas} = this.state;
    user[field] = value;
      if(user.password !== user.password2 ){
        mensajeContraseñas = "Tus contraseñas no coinciden..."
        this.setState({mensajeContraseñas,boton:true})
      }
      else if(user.password === user.password2 && user.password !== "" && user.password2 !== "" && this.state.boton ){
        mensajeContraseñas = "Bien, tus contraseñas SI coinciden"
        this.setState({mensajeContraseñas,infoIncompleta:false,contraseñasCorrectas:true})
      }
    this.setState({user}); 
  }
  //ENVIA LOS DATOS INGRESADOS POR EL USUARIO MEDIANTE EL SERVICIO signup QUE HACE LA CONEXIÓN CON NUESTRO BACKEND
  sendUser = (e) => {
    signup(this.state.user)
    .then(r=>{
      if(r.message){
        this.handleOpen2()
      }
      else{
        this.handleOpen();
      }
    })
  }
  //ABRIR Y CERRAR DIALOGOS INFORMATIVOS
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };

  render() {
    const {mensajeContraseñas} = this.state;
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        onClick={this.handleClose}
      />,
    ];
    const actions2 = [
      <FlatButton
        label="Entendido"
        primary={true}
        onClick={this.handleClose2}
      />,
    ];
    return (
     <div className="loginResponsive">
       <div>
        <AppBar
          style={{backgroundColor: "#78909C"}}
          iconElementLeft={<img src="http://1puntocinco.com/wp-content/uploads/2018/03/logoazul-1024x319.png" width="180" height="60" alt=""/>}
          iconElementRight={
         <a href="https://15onzas.teachable.com/"><FontIcon className="material-icons iconResponsive" color="white">live_help</FontIcon></a>}
        />
       </div>
       <div className="paperSignupResponsive">
        <Paper>
          <br/>
        <FloatingActionButton backgroundColor="#0D47A1" >
        <FontIcon className="material-icons">https</FontIcon>
        </FloatingActionButton>
        <br/>
        <h3>Regístrate</h3>
        <TextField
          hintText="Correo electrónico"
          name="correo"
          floatingLabelText="Correo electrónico"
          onChange={this.onChange}
        />
        <br/>
        <TextField
          hintText="Tu contraseña"
          floatingLabelText="Tu contraseña"
          name="password"
          type="Password"
          onChange={this.onChangeContraseñas}
        />
        <br/>
        <TextField
          hintText="Confirma tu contraseña"
          floatingLabelText="Confirma tu contraseña"
          name="password2"
          type="Password"
          onChange={this.onChangeContraseñas}
        />
        <br/>
        <span style={mensajeContraseñas === "Bien, tus contraseñas SI coinciden" ? {color:'green'} : {color:'red'}}>{mensajeContraseñas}</span>
        <br/>
        <div className="hijoPaper">
        <RaisedButton onClick={this.sendUser} disabled={this.state.infoIncompleta} label="Registrarme" backgroundColor="#0D47A1" labelColor="#FAFAFA"  />
        <br/>
        <h5>Si ya estás registrado <Link to="/" className="linkRegResponsive">Inicia Sesión</Link></h5>
        <br/>
        </div>
        </Paper>
        <div> 
         <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
         >
          Ahora inicia sesión para corroborar que tienes los permisos necesarios para ingresar. 
          </Dialog>
        </div>
        <div> 
         <Dialog
          actions={actions2}
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
         >
          Ups! Algo anda mal, revisa los datos que se te solicitan y los que estas ingresando.
          </Dialog>
        </div>
       </div>
     </div>
    );
  }
}

export default Signup;