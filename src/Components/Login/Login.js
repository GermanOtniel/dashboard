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
import { login } from '../../Services/authDash';
import './login.css';



class Login extends Component {

  state={
    user:{},
    open: false,
    open2: false
  }
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
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {user} = this.state;
    user[field] = value;
    this.setState({user});
    //console.log(this.state.user) 
  }
  
  sendUser = (e) => {
    login(this.state.user)
    .then(user=>{
      if(user.puesto === "SUPERADMIN" || user.puesto === "GERENTE" || user.puesto === "SUPERVISOR" )this.props.history.push("/home");
      else{
        this.handleOpen();
      }
    })
    .catch(e=>this.handleOpen2())
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
    return (
     <div className="padreLogin">
       <div>
        <AppBar
          iconElementLeft={<img src="http://1puntocinco.com/wp-content/uploads/2018/03/logoazul-1024x319.png" width="180" height="60" alt=""/>}
          iconElementRight={
         <a href="https://15onzas.teachable.com/"><FontIcon className="material-icons icon" color="white">live_help</FontIcon></a>}
        />
       </div>
       <div className="paper">
        <Paper>
          <br/><br/>
        <FloatingActionButton secondary={true} >
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
        />
        <br/>
        <TextField
          hintText="Tu contraseña"
          floatingLabelText="Tu contraseña"
          type="Password"
          name="password"
          onChange={this.onChange}
        />
        <br/><br/>
        <div className="hijoPaper">
        <RaisedButton onClick={this.sendUser} label="Ingresar" secondary={true}  />
        <br/>
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
          Debes de registrarte para ingresar. 
          </Dialog>
        </div>
       <br/><br/><br/><br/><br/><br/><br/>
     </div>
    );
  }
}

export default Login;