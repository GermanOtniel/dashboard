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

const styleMenu = {
  fontSize: 22,
  height: 50,
  marginTop:20
}

const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};

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

  // ESTO SE USA SOLO PARA GUARDAR AL USUARIO QUE INGRESO AL DASHBOARD PARA VER QUE
  // PERMISOS TIENE Y VER A QUE RUTAS TIENE PERMISO DE INGRESAR Y A CUALES NO Y 
  // TAMBIEN REVISAMOS SI HAY ALGUN USUARIO GUARDADO EN EL LOCALSTORAGE PARA GUARDAR SU CORREO 
  // POR SI QUIERE CAMBIAR SU CONTRASEÑA PUES MANDAR SU NUEVA CONTRASEÑA A SU CORREO
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

  // ABRIR  Y CERRAR MENU DESPLEGABLE
  handleToggle = () => this.setState({open: !this.state.open});

    // ABRIR Y CERRAR DIALOGOS
  handleOpen = () => {
    this.setState({open2: true,cambios:{}});
  };
  handleClose = () => {
    this.setState({open2: false,passwordIncorrecta:true,passwordCoinciden:true});
  };
  handleOpen2 = () => {
    this.setState({open3: true});
  };
  handleClose2 = () => {
    this.setState({open3: false});
  };


  // GUARDA LA CONTRASEÑA NUEVA QUE EL USUARIO INGRESA Y REVISA QUE LA CONTRASEÑA ACTUAL QUE ESTA INGRESANDO 
  // SEA LA CORRECTA, SINO ES LA CORRECTA NO LO DEJA CAMBIAR SU CONTRASEÑA
  onChange = (e) => {
    let {passwordd} = this.state;
    const field = e.target.name;
    const value = e.target.value;
    const {cambios} = this.state;
    cambios[field] = value;
    if (e.target.name === "passwordAntigua"){
      if(cambios.passwordAntigua !== passwordd){
        this.setState({passwordIncorrecta:true})
      }
      else if(cambios.passwordAntigua === passwordd){
        this.setState({passwordIncorrecta:false})
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

  // FUNCION PARA ENVIAR LA NUEVA CONTRASEÑA Y QUE NUESTRO BACKEND LA PROCESE Y CAMBIE
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

  
  render() {
    const actions = [
      <FlatButton
        label="Enviar cambios"
        primary={true}
        keyboardFocused={true}
        onClick={this.sendNewPassword}
        disabled={this.state.passwordIncorrecta}
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
          title={<img className="imagenLogoResponsive" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed"  alt="Logo de 1puntocinco"/>}
          onLeftIconButtonClick={this.handleToggle}
          iconElementRight={<h6 className="correoDashResponsive">{user.correo}</h6>}
        />
      <div>
      <Drawer
          docked={false}
          width={300}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
        <div>
          {/* <MenuItem leftIcon={<FontIcon className="material-icons">home</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/home`}>Inicio</Link></MenuItem> */}
          <MenuItem leftIcon={<FontIcon className="material-icons icon">assistant</FontIcon>} style={styleMenu}><Link style={{ textDecoration: 'none',color:'black' }} to={`/marcas`}>Marcas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">queue_play_next</FontIcon>} style={styleMenu}><Link style={{ textDecoration: 'none',color:'black' }} to={`/dinamicas`}>Dinámicas</Link></MenuItem>
          {/* <MenuItem leftIcon={<FontIcon className="material-icons">insert_photo</FontIcon>} style={styleMenu}><Link style={{ textDecoration: 'none',color:'black' }} to={`/tickets`}>Evidencias</Link></MenuItem> */}
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
          contentStyle={customContentStyle}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
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
          <b style={!passwordIncorrecta ? {color:'green'} : {color:'red'}} className="msjContraseñas">{!passwordIncorrecta ? "Bien hecho!" : "Ingresa tu contraseña actual"}</b>
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