import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router-dom';
import './dash.css';

const styleMenu = {
  fontSize: 15,
  height: 70,
  marginTop:25
}

class Dash extends Component {

  state={
    open:false
  }

  handleToggle = () => this.setState({open: !this.state.open});
  render() {
    return (
     <div>
        <AppBar
          title={<img src="http://1puntocinco.com/wp-content/uploads/2018/03/logoazul-1024x319.png" width="200" height="73" alt="Logo de 1puntocinco"/>}
          iconElementRight={<a href=""><FontIcon className="material-icons icon" color="white">exit_to_app</FontIcon></a>}
          onLeftIconButtonClick={this.handleToggle}
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
          <MenuItem leftIcon={<FontIcon className="material-icons icon">queue_play_next</FontIcon>} style={styleMenu}   onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/dinamicas`}>Dinámicas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons">insert_photo</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/tickets`}>Tickets</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">signal_cellular_alt</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/reportes`}>Reportes</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">face</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/usuarios`}>Usuarios</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">room</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/zonas`}>Zonas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">store_mall_directory</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/centros`}>Centros de Consumo</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">assistant</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/marcas`}>Marcas</Link></MenuItem>
          <MenuItem leftIcon={<FontIcon className="material-icons icon">work</FontIcon>} style={styleMenu} onClick={this.handleClose}><Link style={{ textDecoration: 'none',color:'black' }} to={`/brands`}>Brands</Link></MenuItem>
        
        </div>
          </Drawer>
      </div>
  
     </div>
    );
  }
}

export default Dash;