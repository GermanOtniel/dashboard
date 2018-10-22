import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {green700,blue500} from 'material-ui/styles/colors';
import { sendNote,getNotesByBrand,getAllNotes,deleteNote } from '../../Services/notas';

const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  },
  button2: {
    width:300,
    height:40,
    float: 'right'
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  }
};

class Mensajes extends Component {

  state={
    open:false,
    newMessage:{},
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
    mensajesFilter:[],
    detalleMensaje:{},
    open2:false,
    alReves:false
  }
 
  // DE NUEVA CUENTA SE HACE DISTINCION ENTRE LOS MESNAJES QUE PUED EVER UN USUARIO Y LOS QUE NO, 
  // AQUI RVISAMOS A QUE BRAND PERTENECE EL USUARIO, SI ES BRAND 1PUNTOCINCO S EMUESTRA TODO SINO 
  // LO ES SOLO SE MUESTRAN LOS MENSAJES QUE LE CORRESPONDEN
  componentWillMount(){
    let brand = `${JSON.parse(localStorage.getItem('user')).brand}`;
    let {mensajesFilter} = this.state;
    if(brand === "5b71bd925c65d40353ffda4c") {
     getAllNotes()
     .then(r=>{
      mensajesFilter = r
      for (let i = 0; i < mensajesFilter.length; i++){
        mensajesFilter[i].created = mensajesFilter[i].created_at.slice(0,10)
        mensajesFilter[i].brand = mensajesFilter[i].remitenteOtro.nombre

        if(mensajesFilter[i].todos === true){
          mensajesFilter[i].global = 'Si'
        }
        else if (mensajesFilter[i].todos === false){
          mensajesFilter[i].global = 'No'
        }
      }
      mensajesFilter.sort((a, b) => new Date(b.created) - new Date(a.created))
      this.setState({mensajesFilter})
     })
     .catch(e=>console.log(e))
    }
    else if (brand !== "5b71bd925c65d40353ffda4c"){
      getNotesByBrand(brand)
      .then(r=>{
        mensajesFilter = r
        for (let i = 0; i < mensajesFilter.length; i++){
          mensajesFilter[i].created = mensajesFilter[i].created_at.slice(0,10)
          mensajesFilter[i].brand = mensajesFilter[i].remitenteOtro.nombre

          if(mensajesFilter[i].todos === true){
            mensajesFilter[i].global = 'Si'
          }
          else if (mensajesFilter[i].todos === false){
            mensajesFilter[i].global = 'No'
          }
        }
        this.setState({mensajesFilter})
      })
      .catch(e=>console.log(e))
    }
 }

 // AQUI SE GUARDA LA INFO QUE SE INGRESA CUANDO SE CREA UN NUEVO MENSAJE
 onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newMessage} = this.state;
  newMessage[field] = value;
  this.setState({newMessage}); 
}

// SE ABREN O CIERRAN DIALOGOS
 handleOpen = (e) =>{
  this.setState({open:true})
}
handleClose = (e) =>{
  this.setState({open:false})
}
handleOpen2 = (e) =>{
  this.setState({open2:true})
}
handleClose2 = (e) =>{
  this.setState({open2:false})
}

// MEDIANTE ESTA FUNCION SE PUEDEN ENVIAR LOS DATOS RECOGIDOS PARA LA CREACION DE UN NUEVO MENSAJE
// SE HACE LA CONEXION CON NUESTRO BACKEND MEDIANTE EL SERVICIO sendNote
sendMessage = () => {
  let brand = `${JSON.parse(localStorage.getItem('user')).brand}`;
  let {newMessage} = this.state;
  newMessage.todos = true
  newMessage.remitenteOtro = brand
  sendNote(newMessage)
  .then(m=>{
    this.handleClose()
    this.componentWillMount()
  })
  .catch(e=>console.log(e))
}

// SE VE EL DETALLE DE UN MENSAJE
mensaje = (mensaje) => {
  let {detalleMensaje} = this.state;
  detalleMensaje = mensaje
  this.setState({detalleMensaje})
  this.handleOpen2()
}

// SE BORRA UN MENSAJE, SE BORRA EN TODOS LADOS, UN MENSAJE GLOBAL ES UN MENSAJE QUE SE MANDA A TODOS, 
// UN MENSAJE QUE SE ENVIA A UN USUARIO EN ESPECIFICO OBVIO NO ES UN MNESAJE GLOBAL, LOS MENSAJES QUE SE 
// MANDAN A UN USUARIO EN ESPECIFICO SE CREAN CUANDO SE DESAPRUEBA UNA EVIDENCIA Y SE LE DICE UNA EXPLIACION 
// AL USUARIO,  A VECES SOLO SE DESAPRUEBA Y NO SE LE MANDA NADA ESOS SON LOS MSJS VACIOS.
borrarMensaje = (mensaje) =>{
  deleteNote(mensaje._id)
  .then(r=>{
  })
  .catch(e=>console.log(e))
  window.location.reload()
}

// FUNCION PARA ACOMODAR LOS MENSAJES POR FECHA
orderByDate = (e) =>{
  let {alReves} = this.state;
  if(alReves === false){
    let {mensajesFilter} = this.state;
    mensajesFilter.sort((a, b) => new Date(a.created) - new Date(b.created))
    this.setState({mensajesFilter,alReves:true})
  }
  else if(alReves === true){
    let {mensajesFilter} = this.state;
    mensajesFilter.sort((a, b) => new Date(b.created) - new Date(a.created))
    this.setState({mensajesFilter,alReves:false})
  }
}
  render() {
    const actions = [
      <RaisedButton 
      onClick={this.sendMessage}  
      label="Enviar Mensaje" 
      backgroundColor="#0D47A1"
      labelColor="#FAFAFA"
      />
    ]
    let {mensajesFilter,detalleMensaje} = this.state;
    return (
    <div>
       <Dash/>
       <div className="zona-container">
        <div>
          <RaisedButton
            label="CREAR MENSAJE"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons">message</FontIcon>}
            //style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
            className="crearDinamicaResponsive" 
          /> 
        </div>
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
                Mensajes Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="Mensaje"><h2>Mensaje</h2></TableHeaderColumn>
              <TableHeaderColumn tooltip="Mensaje"><h2>Global</h2></TableHeaderColumn>
              <TableHeaderColumn tooltip="Fecha de Creación"><h2 onClick={this.orderByDate}>Fecha</h2></TableHeaderColumn>
              <TableHeaderColumn tooltip="Ver Mensaje"><h2>Ver</h2></TableHeaderColumn>
              <TableHeaderColumn tooltip="Borrar Mensaje"><h2>Borrar</h2></TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {mensajesFilter.map( (mensaje, index) => (
              <TableRow key={mensaje._id} data={index}>
                <TableRowColumn>{mensaje.cuerpo}</TableRowColumn>
                <TableRowColumn>{mensaje.global}</TableRowColumn>
                <TableRowColumn>{mensaje.created}</TableRowColumn>
                <TableRowColumn><button onClick={() => this.mensaje(mensaje)} className="buttonDinamicasDetalle">Ver Mensaje</button></TableRowColumn>
                <TableRowColumn><button onClick={() => this.borrarMensaje(mensaje)} className="buttonBorrarMensaje">Borrar Mensaje</button></TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>

       <Dialog
          title="Crea un mensaje"
          modal={false}
          open={this.state.open}
          autoScrollBodyContent={true}
          actions={actions}
          onRequestClose={this.handleClose}
        >
              <TextField
            hintText="Máximo 250 caracteres"
            floatingLabelText="Escribe el cuerpo de tu mensaje"
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio"
            errorStyle={styles.errorStyle}
            onChange={this.onChange}
            name="cuerpo"
            type="text" 
            fullWidth={true}
            maxLength={250}
          />
        </Dialog>

        <Dialog
          title="Detalle de Mensaje"
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
          autoScrollBodyContent={true}
        >
          <span>Cuerpo del Mensaje:</span>
          <h3>{detalleMensaje.cuerpo}</h3>
          <span>Fecha de Creación: </span>
          <b>{detalleMensaje.created}</b>
          <br/><br/>
          <span>Brand: </span>
          <b>{detalleMensaje.brand}</b>
        </Dialog>
    </div>
    );
  }
}

export default Mensajes;