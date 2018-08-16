import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import { getUser } from '../../Services/authDash';
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
    user:{}
  }
  componentWillMount(){
    let id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getUser(id)
    .then(user=>{
      this.setState({user})
    })
    .catch(e=>console.log(e));
  }

  handleToggle = () => this.setState({open: !this.state.open});
  render() {
    const {user} = this.state;
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
          <MenuItem 
          leftIcon={<FontIcon className="material-icons">home</FontIcon>} 
          style={styleMenu} 
          onClick={this.handleClose}>
           <Link 
            style={{ textDecoration: 'none',color:'black' }} 
            to={`/home`}>Inicio
           </Link>
          </MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">assistant</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/marcas`}>Marcas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">queue_play_next</FontIcon>} style={styleMenu}   onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/dinamicas`}>Dinámicas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons">insert_photo</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/tickets`}>Tickets</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">signal_cellular_alt</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/reportes`}>Reportes</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">work</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/brands`}>Brands</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">store_mall_directory</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/centros`}>Centros de Consumo</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">face</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/usuarios`}>Usuarios</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">room</FontIcon>} style={user.puesto === "SUPERADMIN" ? styleMenu : {display:"none"}} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/zonas`}>Zonas</Link></MenuItem>

        </div>
          </Drawer>
      </div>
  
     </div>
    );
  }
}

export default Dash;