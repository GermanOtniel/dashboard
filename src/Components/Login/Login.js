import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import { login,getNewPasswordDash } from '../../Services/authDash';
import './login.css';



class Login extends Component {

  state={
    user:{},
    open: false,
    open2: false,
    open3: false,
    open4:false,
    userLogged:{},
    correo:{}
  }
  //REVISAR SI HAY DATOS GUARDADOS EN EL LOCALSTORAGE, SI LOS HAY UTILIZARLOS PARA AUTOCOMPLETAR EL FORMULARIO DE LOGIN
  componentWillMount(){
    let usuarioGuardado;
    let hayUsuario = `${JSON.parse(localStorage.getItem('userLoggedDash'))}`;
    if ( hayUsuario === "null" ){
      usuarioGuardado = false
    }
    else{
      usuarioGuardado = true
    }
    if(usuarioGuardado){
      let {userLogged} = this.state;
      userLogged.correo = `${JSON.parse(localStorage.getItem('userLoggedDash')).correo}`;
      userLogged.password = `${JSON.parse(localStorage.getItem('userLoggedDash')).password}`;
      this.setState({userLogged,user:userLogged})
    }
 }
//ABRIR Y CERRAR DIALOGOS
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
  //GUARDAR LA INFORMACIÓN QUE EL USUARIO INGRESA EN EL FORMULARIO DE LOGIN
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {user} = this.state;
    user[field] = value;
    this.setState({user});
  }
  //GUARDAR EL CORREO QUE EL USUARIO INGRESA PARA RECUPERAR SU CONTRASEÑA
  onChange2 = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {correo} = this.state;
    correo[field] = value;
    this.setState({correo}); 
  }
  //LA FUNCIÓN QUE ENVIA LOS DATOS INGRESADOS DEL USUARIO (CORREO/CONTRASEÑA) PARA QUE NUESTRO BACKEND LOS RECIBA, PROCESE Y EJECUTE ACCIONES
  //LA FUNCION login ES EL SERVICIO QUE CONECTA NUESTRO FRONTEND CON NUESTRO BACKEND Y LA RUTA DESEADA.
  sendUser = (e) => {
    localStorage.setItem('userLoggedDash', JSON.stringify(this.state.user))
    login(this.state.user)
    .then(user=>{
      if(user.puesto === "SUPERADMIN" || user.puesto === "GERENTE" || user.puesto === "SUPERVISOR" )this.props.history.push("/dinamicas");
      else{
        this.handleOpen();
      }
    })
    .catch(e=>this.handleOpen2())
  }
//ESTA FUNCION PERMITE QUE EL USUARIO SI QUIERE CAMBIAR LOS VALORES DEL INPUT CORREO E INPUT PASSWORD LOS PUEDA CAMBIAR
//ES DECIR SI HACEN CLICK EN EL INPUT EL INPUT SE VUELVA UN STRING VACIO Y PERMITA ESCRIBIR ALGO AL USUARIO
  onCheck = (e) =>{
    let {userLogged} = this.state;
    let {user} = this.state;
    if(e.target.name === "correo"){
        userLogged.correo = false;
        user.correo = ""
        this.setState({userLogged,user})
    }
    else if(e.target.name === "password")
      userLogged.password = false;
      user.password = ""
      this.setState({userLogged,user})
  }
  //SE HIZO ESTA FUNCION QUE NO HACE NADA PARA UTILIZAR UN TERNARIO EN EL ONCLICK DEL RESPECTIVO INPUT
  nada = (e) =>{
    //jajaja no hace nada pero a la vez si...esto es la programacion beibe!!!
  }
  //ES LA FUNCION QUE UTILIZA EL SERVICIO PARA QUE NUETSROS USUARIOS PUEDAN OBTENER UNA CONTRASEÑA TEMPORAL SI ES QUE OLVIDARON 
  //SU CONTRASEÑA, LES LLEGARA POR MEDIO DE SU CORREO ELECTRONICO 
  getNewPassword = () =>{
    let {correo} = this.state;
    getNewPasswordDash(correo)
    .then(r=>{
          this.handleClose3()
          this.handleOpen4()
    })
    .catch(e=>console.log(e))
  }
  render() {
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
    const {userLogged,user} = this.state;
    return (
     <div className="padreLogin">
       <div>
        <AppBar
          style={{backgroundColor: "#78909C"}}
          iconElementLeft={<img src="http://1puntocinco.com/wp-content/uploads/2018/03/logoazul-1024x319.png" width="180" height="60" alt=""/>}
          iconElementRight={
         <a href="https://15onzas.teachable.com/"><FontIcon className="material-icons icon" color="white">live_help</FontIcon></a>}
        />
       </div>
       <div className="paper">
        <Paper>
          <br/><br/>
        <FloatingActionButton backgroundColor="#0D47A1" >
        <FontIcon className="material-icons">https</FontIcon>
        </FloatingActionButton>
        <br/>
        <h3>Iniciar Sesión</h3>
        <br/>
        <TextField
          hintText="Correo electrónico"
          floatingLabelText="Correo electrónico"
          name="correo"
          onChange={this.onChange}
          onClick={userLogged.correo ? this.onCheck : this.nada}
          value={userLogged.correo ? userLogged.correo : user.correo}
        />
        <br/>
        <TextField
          hintText="Tu contraseña"
          floatingLabelText="Tu contraseña"
          type="Password"
          name="password"
          onChange={this.onChange}
          onClick={userLogged.correo ? this.onCheck : this.nada}
          value={userLogged.correo ? userLogged.password : user.password }
        />
        <br/><br/>
        <div className="hijoPaper">
        <RaisedButton onClick={this.sendUser} label="Ingresar" backgroundColor="#0D47A1" labelColor="#FAFAFA"  />
        <br/>
        <br/>
        <b className="contraseñaOlvidada" onClick={this.handleOpen3}>Olvidé mi contraseña</b>
        <h5>Si aún no estás registrado <Link to="/signup" className="linkReg">Regístrate</Link></h5>
        <br/>
        </div>
        </Paper>
       </div>
        <div> 
         <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
         >
          Aún no tienes los permisos necesarios para ingresar. 
          </Dialog>
        </div>
        <div> 
         <Dialog
          actions={actions2}
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
         >
          Parece que aún no estás registrado ó tu contraseña es incorrecta.
          </Dialog>
        </div>
        <div>
        <Dialog
          title="Restablecer contraseña"
          modal={false}
          open={this.state.open3}
          onRequestClose={this.handleClose3}
          autoScrollBodyContent={true}      
        > 
        Parece que has olvidado tu contraseña, por favor Ingresa el correo electrónico con el cual te regístraste, ya que a esa dirección te mandaremos 
        la contraseña temporal con la cual podrás volver a Ingresar a tu cuenta.
        <br/>
        <TextField
              onChange={this.onChange2} 
              name="correito" 
              floatingLabelText="Correo electrónico"
              type="email"  
              underlineShow={true}
            />
            <br/>
            <RaisedButton 
              onClick={this.getNewPassword}  
              label="Enviar" 
              backgroundColor="#B71C1C"
              labelColor="#FAFAFA"
            />
        </Dialog>  

        </div> 
        <div>
        <Dialog
          modal={false}
          open={this.state.open4}
          onRequestClose={this.handleClose4}
          autoScrollBodyContent={true}      
        > 
         Revisa tu correo electrónico, tu contraseña temporal ha sido enviada.
         <br/>
         Una vez que hayas Ingresado actualiza tu contraseña nuevamente.
        </Dialog>  

        </div>  
       <br/><br/><br/><br/><br/><br/><br/>
     </div>
    );
  }
}

export default Login;