import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {green700,blue500} from 'material-ui/styles/colors';
import {Link} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import './evidencias.css';
import { getEvidences,getEvidencesByBrand,deleteEvidence } from '../../Services/evidencias';

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


class Evidencias extends Component {

  state={
    newMarca:{},
    fecha:"",
    newObj:{},
    evidencias:[],
    evidenciasFilter:[],
    marcas:[],
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
    height: '300px',
    alReves:false,
    alReves2:false,
    evidenciaBorrar:{},
    open:false
  }
  componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user')).brand}`;

    // SI EL USUARIO ES DEL BRAND 1PUNTCINCO ES DECIR ES SUPERADMIN
    // VAS A USAR EL SERVICIO QUE TRAE TOOOOODAS LAS EVIDENCIAS

    if(id === "5b71bd925c65d40353ffda4c") {
    getEvidences()
     .then(evidencias=>{
      let dinamicas = evidencias.map(evidencia=> evidencia.dinamica);
      let nombre = evidencias.map(evidencia=> evidencia.creador.nombre);
      for(let i= 0; i < evidencias.length;i++) 
        {
          evidencias[i].creador = nombre[i]
          evidencias[i].created_at = evidencias[i].created_at.slice(0,10)
          evidencias[i].dinamica = dinamicas[i].nombreDinamica
          
        }
        evidencias.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    this.setState({evidencias,evidenciasFilter:evidencias})
     })
     .catch(e=>console.log(e))
    }

    // SI EL USUARIO NO ES UN SUPERADMIN, ES DECIR, ES DE CUALQUIER OTRO BRAND, 
    // VAS A TRAER LAS EVIDENCIAS QUE SOLO PERTENECEN A ESE BRAND
    else if (id !== "5b71bd925c65d40353ffda4c"){
   getEvidencesByBrand(id)
   .then(evidencias=>{
    let dinamicas = evidencias.map(evidencia=> evidencia.dinamica);
    let nombre = evidencias.map(evidencia=> evidencia.creador.nombre);
    for(let i= 0; i < evidencias.length;i++) 
      {
        evidencias[i].creador = nombre[i]
        evidencias[i].created_at = evidencias[i].created_at.slice(0,10)
        evidencias[i].dinamica = dinamicas[i].nombreDinamica
        
      }
      evidencias.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  this.setState({evidencias,evidenciasFilter:evidencias})
   })
   .catch(e=>console.log(e))
    }  
    
   }


   filterList = (e) =>{
    var updatedList = this.state.evidencias.map(evidencia=>evidencia);
    updatedList = updatedList.map(evidencia=>evidencia).filter(function(item){
      return item.dinamica.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1 || item.status.toLowerCase().search(
          e.target.value.toLowerCase()) !== -1 || item.modalidad.toLowerCase().search(
            e.target.value.toLowerCase()) !== -1;
    });
    this.setState({evidenciasFilter: updatedList})
  }
  orderByDate = (e) => {
    let {alReves} = this.state;
    if(alReves === false){
      let {evidenciasFilter} = this.state;
      evidenciasFilter.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      this.setState({evidenciasFilter,alReves:true})
    }
    else if(alReves === true){
      let {evidenciasFilter} = this.state;
      evidenciasFilter.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      this.setState({evidenciasFilter,alReves:false})
    }
  }
  orderByState = (e) => {
    let {alReves2} = this.state;
    if(alReves2 === false){
      let {evidenciasFilter} = this.state;
      evidenciasFilter.sort((a, b) => a.status !== b.status ? a.status < b.status ? -1 : 1 : 0)
      this.setState({evidenciasFilter,alReves2:true})
    }
    else if(alReves2 === true){
      let {evidenciasFilter} = this.state;
      evidenciasFilter.sort((a, b) => b.status !== a.status ? b.status < a.status ? -1 : 1 : 0)
      this.setState({evidenciasFilter,alReves2:false})
    }
  }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,evidenciaBorrar:{}});
  };
  deleteEvidence=(evidencia)=>{
    this.setState({evidenciaBorrar:evidencia})
    this.handleOpen()
  }
  sendEvidenceForDelete = ()=>{
    let {evidenciaBorrar} = this.state;
    deleteEvidence(evidenciaBorrar._id)
    .then(r=>{
      this.handleClose();
      window.location.reload()
    })
    .catch(e=>console.log(e))

  }

  render() {
    const actions = [
      <FlatButton
        label="Si, Borrar"
        primary={true}
        keyboardFocused={true}
        onClick={this.sendEvidenceForDelete}
      />,
      <FlatButton
        label="Cancelar"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ];
    return (
    <div>
       <Dash/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="EVIDENCIAS"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons">insert_photo</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
          /> 
         </div>
       </div>
       <div className="buscadorEvidencias">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Dinámica ó Modalidad ó Estado" type="text" onChange={this.filterList}/>
      </div>
    <br/>
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
              <TableHeaderColumn colSpan="7"  style={{textAlign: 'center'}}>
                Marcas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn><h2 onClick={this.orderByDate}>Fecha de Creación</h2></TableHeaderColumn>
              <TableHeaderColumn><h3>Dinamica Perteneciente</h3></TableHeaderColumn>
              <TableHeaderColumn><h2 onClick={this.orderByState}>Estado</h2></TableHeaderColumn>
              <TableHeaderColumn><h2>Usuario</h2></TableHeaderColumn>
              <TableHeaderColumn><h2>Modalidad</h2></TableHeaderColumn>
              <TableHeaderColumn><h2>Revisar</h2></TableHeaderColumn>
              <TableHeaderColumn><h2>Borrar</h2></TableHeaderColumn>


            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
          {/* value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) */}

            {this.state.evidenciasFilter.map( (evidencia, index) => (
              <TableRow key={evidencia._id} data={evidencia}>
                <TableRowColumn>{evidencia.created_at}</TableRowColumn>
                <TableRowColumn>{evidencia.dinamica}</TableRowColumn>
                <TableRowColumn>{evidencia.status}</TableRowColumn>
                <TableRowColumn>{evidencia.creador}</TableRowColumn>
                <TableRowColumn>{evidencia.modalidad}</TableRowColumn>
                <TableRowColumn><Link to={`/evidencia/${evidencia._id}`}><button className="buttonDinamicasDetalle">Ver Detalle</button></Link></TableRowColumn>
                <TableRowColumn><button onClick={()=>this.deleteEvidence(evidencia)} className="botonDinamicaBorrar">Borrar</button></TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
          <Dialog
          title="¿Estás seguro?"
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          Esta decisión es irreversible, si borras esta evidencia sera de manera permanente y no podras visualizar mas tarde ningún detalle relacionado a esta.
          <br/><br/>
          Las evidencias se usan a lo largo de la vida de una dinámica para seguir visualizando las ventas generadas por la dinámica a la que corresponde.
          <h3>Te recomendamos no borrar ninguna evidencia de alguna dinámica que aún este en uso.</h3>

        </Dialog>
          </div>
    </div>
    );
  }
}

export default Evidencias;