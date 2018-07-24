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
import './login.css';



class Signup extends Component {

  state={
    user:{},
    open:false
  }

  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {user} = this.state;
    user[field] = value;
    this.setState({user});
    console.log(this.state.user) 
  }
  
  sendUser = (e) => {
    signup(this.state.user)
    .then(user=>{
      this.handleOpen();
    })
  }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        onClick={this.handleClose}
      />,
    ];
    return (
     <div className="padreLogin">
       <div>
        <AppBar
          iconElementLeft={<img src="http://1puntocinco.com/wp-content/uploads/2018/03/logoazul-1024x319.png" width="180" height="60" alt=""/>}
          iconElementRight={
         <a href="http://1puntocinco.com/"><FontIcon className="material-icons icon" color="white">live_help</FontIcon></a>}
        />
       </div>
       <div className="paper">
        <Paper>
          <br/><br/>
        <FloatingActionButton secondary={true} >
        <FontIcon className="material-icons">https</FontIcon>
        </FloatingActionButton>
        <br/>
        <h3>Regístrate</h3>
        <br/>
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
          onChange={this.onChange}
        />
        <br/>
        <TextField
          hintText="Confirma tu contraseña"
          floatingLabelText="Confirma tu contraseña"
          type="Password"
          onChange={this.onChange}
        />
        <br/><br/>
        <div className="hijoPaper">
        <RaisedButton onClick={this.sendUser} label="Registrarme" secondary={true}  />
        <br/>
        <h5>Si ya estás registrado <Link to="/" className="linkReg">Inicia Sesión</Link></h5>
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
       </div>
       <br/><br/><br/><br/><br/><br/><br/>
     </div>
    );
  }
}

export default Signup;