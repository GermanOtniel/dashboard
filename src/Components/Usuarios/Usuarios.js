import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom';
import { getUsers } from '../../Services/usuarios';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import './usuarios.css';


const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  }
};

class Usuarios extends Component {

  state={
    open:false,
    users:[],
    usuariosFilter:[],
    iniciaStateDeTabla: "_REPITO INICIA STATE DE TABLA_",
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: true,
    showRowHover: true,
    selectable: true,
    multiSelectable: false,
    enableSelectAll: true,
    deselectOnClickaway: true,
    showCheckboxes: true,
    height: '300px'
  }

  componentWillMount(){
    getUsers()
    .then(users=>{
      for(let i= 0; i < users.length;i++) 
        {
          users[i].created_at = users[i].created_at.slice(0,10)
          
        }
      this.setState({usuariosFilter:users,users})
    })
    .catch(e=>console.log(e))
 }
 handleOpen = () => {
  this.setState({open: true});
};
handleClose = () => {
  this.setState({open: false});
};

filterList = (e) =>{
  var updatedList = this.state.users.map(dinamic=>dinamic);
  updatedList = updatedList.map(usuario=>usuario).filter(function(item){
    return item.correo.toLowerCase().search(
      e.target.value.toLowerCase()) !== -1;
  });
  this.setState({usuariosFilter: updatedList})
}
  render() {
    
    return (
    <div>
       <Dash/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="EDITAR USUARIOS"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons">face</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
          /> 
         </div>
       </div>
       <div className="buscador">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Usuario por Correo" type="text" onChange={this.filterList}/>
      </div>
       <div>
       <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn colSpan="5" tooltip="Super Header" style={{textAlign: 'center'}}>
                Zonas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="Correo Electrónico">Correo Electrónico</TableHeaderColumn>
              <TableHeaderColumn tooltip="Puesto">Puesto</TableHeaderColumn>
              <TableHeaderColumn tooltip="Fecha de Alta">Fecha de Registro</TableHeaderColumn>
              <TableHeaderColumn tooltip="Fecha de Alta">Nombre</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Editar</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.usuariosFilter.sort((a, b) => a.correo !== b.correo ? a.correo < b.correo ? -1 : 1 : 0)
.map( (user, index) => (
              <TableRow key={user._id} data={user}>
                <TableRowColumn>{user.correo}</TableRowColumn>
                <TableRowColumn>{user.puesto}</TableRowColumn>
                <TableRowColumn>{user.created_at}</TableRowColumn>
                <TableRowColumn>{user.nombre}</TableRowColumn>
                <TableRowColumn><Link to={`/usuario/${user._id}`}><button className="buttonDinamicasDetalle">Ver Detalle</button></Link></TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
    </div>
    );
  }
}

export default Usuarios;