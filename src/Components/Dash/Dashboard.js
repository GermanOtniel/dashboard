import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import { getUser,changePasswordDash } from '../../Services/authDash';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router-dom';
import './dash.css';

const styleMenu = {
  fontSize: 22,
  height: 50,
  marginTop:20
}


class Dash extends Component {

  state={
    open:false,
    user:{},
    open2:false,
    open3:false,
    cambios:{},
    passwordIncorrecta:true,
    passwordCoinciden:true,
    passwordd:"",
    correoo:"",
    msjConf:""
  }
  componentWillMount(){
    let id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    const userLogged = `${JSON.parse(localStorage.getItem('userLoggedDash'))}`;
    getUser(id)
    .then(user=>{
      this.setState({user})
    })
    .catch(e=>console.log(e));
    if(userLogged !== "null"){
      const correo = `${JSON.parse(localStorage.getItem('userLoggedDash')).correo}`;
      const password = `${JSON.parse(localStorage.getItem('userLoggedDash')).password}`;
      this.setState({passwordd:password,correoo:correo})
    }
  }

  handleOpen = () => {
    this.setState({open2: true});
  };
  handleClose = () => {
    this.setState({open2: false});
  };
  handleOpen2 = () => {
    this.setState({open3: true});
  };
  handleClose2 = () => {
    this.setState({open3: false});
  };
  onChange = (e) => {
    let {passwordd} = this.state;
    const field = e.target.name;
    const value = e.target.value;
    const {cambios} = this.state;
    cambios[field] = value;
    if (e.target.name === "passwordAntigua"){
      if(cambios.passwordAntigua !== passwordd){
        this.setState({passwordIncorrecta:false})
      }
      else if(cambios.passwordAntigua === passwordd){
        this.setState({passwordIncorrecta:true})
      }
    }
   else if (e.target.name === "passwordNew2" || e.target.name === "passwordNew"){
    if(cambios.passwordNew !== cambios.passwordNew2){
      this.setState({passwordCoinciden:false})
    }
    else if(cambios.passwordNew === cambios.passwordNew2){
      this.setState({passwordCoinciden:true})
    }
   }
    this.setState({cambios}); 
  }

  sendNewPassword = () => {
    let {correoo,cambios} = this.state;
    let body = {
      correo:correoo,
      newPasswordString:cambios.passwordNew
    }
    changePasswordDash(body)
    .then(r=>{
      this.setState({msjConf:r.message})
      this.handleClose()
      this.handleOpen2()
    })
    .catch(e=>console.log(e))
  }

  handleToggle = () => this.setState({open: !this.state.open});
  render() {
    const actions = [
      <FlatButton
        label="Enviar cambios"
        primary={true}
        keyboardFocused={true}
        onClick={this.sendNewPassword}
        disabled={!this.state.passwordIncorrecta}
      />,
      <FlatButton
        label="Cancelar"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    const {user,passwordIncorrecta,passwordCoinciden,msjConf} = this.state;
    return (
     <div>
        <AppBar
          style={{backgroundColor: "#78909C"}}
          title={<img src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed" width="200" height="73" alt="Logo de 1puntocinco"/>}
          onLeftIconButtonClick={this.handleToggle}
          iconElementRight={<h6 className="correoDash">{user.correo}</h6>}
        />
      <div>
      <Drawer
          docked={false}
          width={400}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
        <div>
          {/* <MenuItem 
          leftIcon={<FontIcon className="material-icons">home</FontIcon>} 
          style={styleMenu} 
          onClick={this.handleClose}>
           <Link 
            style={{ textDecoration: 'none',color:'black' }} 
            to={`/home`}>Inicio
           </Link>
          </MenuItem> */}
          <MenuItem leftIcon={<FontIcon className="material-icons icon">assistant</FontIcon>} style={styleMenu}><Link style={{ textDecoration: 'none',color:'black' }} to={`/marcas`}>Marcas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">queue_play_next</FontIcon>} style={styleMenu}><Link style={{ textDecoration: 'none',color:'black' }} to={`/dinamicas`}>Dinámicas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons">insert_photo</FontIcon>} style={styleMenu}><Link style={{ textDecoration: 'none',color:'black' }} to={`/tickets`}>Evidencias</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">signal_cellular_alt</FontIcon>} style={styleMenu}><Link style={{ textDecoration: 'none',color:'black' }} to={`/reportes`}>Reportes</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">work</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}}><Link style={{ textDecoration: 'none',color:'black' }} to={`/brands`}>Brands</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">store_mall_directory</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}}><Link style={{ textDecoration: 'none',color:'black' }} to={`/centros`}>Centros de Consumo</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">face</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}}><Link style={{ textDecoration: 'none',color:'black' }} to={`/usuarios`}>Usuarios</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">room</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}}><Link style={{ textDecoration: 'none',color:'black' }} to={`/zonas`}>Zonas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">message</FontIcon>} style={styleMenu} ><Link style={{ textDecoration: 'none',color:'black' }} to={`/mensajes`}>Mensajes</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">apps</FontIcon>} style={styleMenu} onClick={this.handleOpen}>Cambiar contraseña</MenuItem>
        </div>
          </Drawer>
      </div>
      <div>
          <Dialog
          title="Cambia tu contraseña"
          modal={false}
          actions={actions}
          open={this.state.open2}
          onRequestClose={this.handleClose}
        >
        <b>Primero ingresa tu contraseña actual y despues tu nueva contraseña.</b>
        <br/>
        <TextField
          hintText="Contraseña actual"
          floatingLabelText="Contraseña actual"
          type="Password"
          name="passwordAntigua"
          onChange={this.onChange}
        />
         <div>
          <b style={passwordIncorrecta ? {color:'green'} : {color:'red'}} className="msjContraseñas">{passwordIncorrecta ? "" : "La contraseña que estas ingresando es incorrecta"}</b>
        </div>
         <TextField
          hintText="Nueva contraseña"
          floatingLabelText="Nueva contraseña"
          type="Password"
          name="passwordNew"
          onChange={this.onChange}
        />
         <TextField
          hintText="Repite tu nueva contraseña"
          floatingLabelText="Repite tu nueva contraseña"
          type="Password"
          name="passwordNew2"
          onChange={this.onChange}
        />
        <div>
          <b style={passwordCoinciden ? {color:'green'} : {color:'red'}} className="msjContraseñas">{passwordCoinciden ? "" : "Las contraseñas no coinciden"}</b>
        </div>
        </Dialog>
          </div>
          <div>
          <Dialog
          modal={false}
          open={this.state.open3}
          onRequestClose={this.handleClose2}
        >
        {msjConf}
        </Dialog>
          </div>
  
     </div>
    );
  }
}

export default Dash;