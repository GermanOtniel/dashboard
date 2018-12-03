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



class Usuarios extends Component {

  state={
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
    showCheckboxes: false,
    height: '300px',
    alReves:false,
    alReves2:false,
    alReves3:false,
    arr:[]
  }
// ESTE COMPONENTE SOLO LO VISUALIZAN LOS SUPERADMINS ASI QUE USAMOS UN SERVICIO PARA TRAER TODOS LOS 
// USUARIOS QUE EXISTEN EN NUESTRA BASE DE DATOS
  componentWillMount(){
    getUsers()
    .then(users=>{
      let {arr} = this.state;
      for(let i= 0; i < users.length;i++) 
        {
          users[i].created_at = users[i].created_at.slice(0,10) 
          arr.push(users[i].correo)
        }
        users.sort((a, b) => a.correo !== b.correo ? a.correo < b.correo ? -1 : 1 : 0)
      this.setState({usuariosFilter:users,users,arr})
    })
    .catch(e=>console.log(e))
 }

 // SE USA PARA BUSCAR USUARIOS POR CORREO POR PUESTO O POR FECHA DE REGISTRO
filterList = (e) =>{
  var updatedList = this.state.users.map(dinamic=>dinamic);
  updatedList = updatedList.map(usuario=>usuario).filter(function(item){
    return item.correo.toLowerCase().search(
      e.target.value.toLowerCase()) !== -1 || item.puesto.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1 || item.created_at.toLowerCase().search(
          e.target.value.toLowerCase()) !== -1 ;
  });
  this.setState({usuariosFilter: updatedList})
}

// SE USA PARA ORDENAR LOS USUARIOS POR FECHA DE REGISTRO 
orderByDate = (e) => {
  let {alReves} = this.state;
  if(alReves === false){
    let {usuariosFilter} = this.state;
    usuariosFilter.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    this.setState({usuariosFilter,alReves:true})
  }
  else if(alReves === true){
    let {usuariosFilter} = this.state;
    usuariosFilter.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    this.setState({usuariosFilter,alReves:false})
  }
}

// SE USA PARA ORDENAR LOS USARIOS POR SU EMAIL
orderByEmail = (e) => {
  let {alReves2} = this.state;
  if(alReves2 === false){
    let {usuariosFilter} = this.state;
    usuariosFilter.sort((a, b) => b.correo !== a.correo ? b.correo < a.correo ? -1 : 1 : 0)
    this.setState({usuariosFilter,alReves2:true})
  }
  else if(alReves2 === true){
    let {usuariosFilter} = this.state;
    usuariosFilter.sort((a, b) => a.correo !== b.correo ? a.correo < b.correo ? -1 : 1 : 0)
    this.setState({usuariosFilter,alReves2:false})
  }
}

// SE USA PARA ORDENAR USUARIOS POR SU PUESTO
orderByPuesto = (e) => {
  let {alReves3} = this.state;
  if(alReves3 === false){
    let {usuariosFilter} = this.state;
    usuariosFilter.sort((a, b) => b.puesto !== a.puesto ? b.puesto < a.puesto ? -1 : 1 : 0)
    this.setState({usuariosFilter,alReves3:true})
  }
  else if(alReves3 === true){
    let {usuariosFilter} = this.state;
    usuariosFilter.sort((a, b) => a.puesto !== b.puesto ? a.puesto < b.puesto ? -1 : 1 : 0)
    this.setState({usuariosFilter,alReves3:false})
  }
}

  render() {
    
    return (
    <div>
       <Dash/>
       <br/><br/><br/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="EDITAR USUARIOS"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons">face</FontIcon>}
            labelStyle={{fontSize:'18px'}}
            className="crearDinamicaResponsive"
          /> 
         </div>
       </div>
       <div className="buscador">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Busca cualquier usuario" type="text" onChange={this.filterList}/>
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
              <TableHeaderColumn colSpan="4" tooltip="Super Header" style={{textAlign: 'center'}}>
                Usuarios Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn ><h2 onClick={this.orderByEmail}>Mail</h2></TableHeaderColumn>
              <TableHeaderColumn > <h2 onClick={this.orderByPuesto}>Puesto</h2></TableHeaderColumn>
              {/* <TableHeaderColumn ><h2 onClick={this.orderByDate}>Registro</h2></TableHeaderColumn> */}
              <TableHeaderColumn > <h2>Nombre</h2></TableHeaderColumn>
              <TableHeaderColumn ><h2>Editar</h2></TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.usuariosFilter.map( (user, index) => (
              <TableRow key={user._id} data={user}>
                <TableRowColumn>{user.correo}</TableRowColumn>
                <TableRowColumn>{user.puesto}</TableRowColumn>
                {/* <TableRowColumn>{user.created_at}</TableRowColumn> */}
                <TableRowColumn>{user.nombre}</TableRowColumn>
                <TableRowColumn><Link to={`/usuario/${user._id}`}><button className="buttonDinamicasDetalle">Ver Detalle</button></Link></TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div style={{display:'none'}}>
            <table id="tableMarcas">
              <thead>
                <tr>
                  <th>Correos:</th>
                </tr>
              </thead>
              <tbody>
                {this.state.arr.map( (correo, index) => (
                  <tr key={index}>
                  <td>{correo}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
    </div>
    );
  }
}

export default Usuarios;