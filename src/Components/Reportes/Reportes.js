import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { getDinamics,getDinamicsByBrand } from '../../Services/dinamicas';
import './reportes.css';

const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  },
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  }
};

class Reportes extends Component {

  state={
    open:false,
    newDinamic:{},
    dinamics:[],
    newObj:{},
    newObj2:{},
    dinamicasFilter:[],
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
    alReves2:false
  }
  handleRequestDelete = (label) => {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(label);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
  };
  handleRequestDelete2 = (label) => {
    this.chipData = this.state.chipData2;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(label);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData2: this.chipData});
  };
  componentWillMount(){
     //ID DEL BRAND
     const id = `${JSON.parse(localStorage.getItem('user')).brand}`;
    //ESTE ES EL SERVICIO PARA TRAER LAS DINAMICAS QUE EXISTEN Y REPRESENTARLAS EN LA TABLA
    if(id === "5b71bd925c65d40353ffda4c") {
      getDinamics()
    .then(dinamics=>{
      let brands = dinamics.map(dinamic => dinamic.brand.nombre);
      for(let i= 0; i < dinamics.length;i++) 
       {
         dinamics[i].brand = brands[i]
         dinamics[i].fechaI = dinamics[i].fechaInicio.slice(0,10)
         dinamics[i].fechaF = dinamics[i].fechaFin.slice(0,10)

       }
       dinamics.sort((a, b) => new Date(a.fechaFin) - new Date(b.fechaFin))
      this.setState({dinamicasFilter:dinamics,dinamics})
    })
    .catch(e=>console.log(e))
    }
    else if (id !== "5b71bd925c65d40353ffda4c"){
      getDinamicsByBrand(id)
      .then(dinamics=>{
       let brands = dinamics.map(dinamic => dinamic.brand.nombre);
       for(let i= 0; i < dinamics.length;i++) 
        {
          dinamics[i].brand = brands[i]
          dinamics[i].fechaI = dinamics[i].fechaInicio.slice(0,10)
          dinamics[i].fechaF = dinamics[i].fechaFin.slice(0,10)
        }
        dinamics.sort((a, b) => new Date(a.fechaFin) - new Date(b.fechaFin))
       this.setState({dinamicasFilter:dinamics,dinamics})
     })
     .catch(e=>console.log(e))
    } 
  }
   filterList = (e) =>{
    var updatedList = this.state.dinamics.map(dinamic=>dinamic);
    updatedList = updatedList.map(dinamic=>dinamic).filter(function(item){
      return item.nombreDinamica.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1 || item.modalidad.toLowerCase().search(
            e.target.value.toLowerCase()) !== -1;
    });
    this.setState({dinamicasFilter: updatedList})
  }
  orderByFechai = () => {
    let {alReves} = this.state;
    if(alReves === false){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => new Date(b.fechaI) - new Date(a.fechaI))
      this.setState({dinamicasFilter,alReves:true})
    }
    else if(alReves === true){
      let {dinamicasFilter} = this.state;
      dinamicasFilter.sort((a, b) => new Date(a.fechaI) - new Date(b.fechaI))
      this.setState({dinamicasFilter,alReves:false})
    }
  }
orderByFechaF = () => {
  let {alReves2} = this.state;
  if(alReves2 === false){
    let {dinamicasFilter} = this.state;
    dinamicasFilter.sort((a, b) => new Date(b.fechaF) - new Date(a.fechaF))
    this.setState({dinamicasFilter,alReves2:true})
  }
  else if(alReves2 === true){
    let {dinamicasFilter} = this.state;
    dinamicasFilter.sort((a, b) => new Date(a.fechaF) - new Date(b.fechaF))
    this.setState({dinamicasFilter,alReves2:false})
  }
  }
  render() {
    
    return (
    <div>
       <Dash/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="REPORTES"
            labelPosition="before"
            labelColor="#FAFAFA"
            backgroundColor="#0D47A1"
            icon={<FontIcon className="material-icons">signal_cellular_alt</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
          /> 
         </div>
       </div>
       <div className="buscador">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Busca una dinámica" type="text" onChange={this.filterList}/>
      </div>
       <div>
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
              <TableHeaderColumn colSpan="7" style={{textAlign: 'center'}}>
                Reportes de Dinámicas
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn><h3>Modalidad</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>BRAND</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Nombre</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Status</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByFechai}>Fecha de Inicio</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByFechaF}>Fecha de Término</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Ver</h3></TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.dinamicasFilter.map( (dinamic, index) => (
              <TableRow key={dinamic._id} data={dinamic}>
                <TableRowColumn>{dinamic.modalidad}</TableRowColumn>
                <TableRowColumn>{dinamic.brand}</TableRowColumn>
                <TableRowColumn>{dinamic.nombreDinamica}</TableRowColumn>
                <TableRowColumn>{dinamic.status}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaI}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaF}</TableRowColumn>
                <TableRowColumn><Link to={`/dinamica/${dinamic._id}`}><button className="buttonDinamicasDetalle">Ver Detalle</button></Link></TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       </div>
    </div>
    );
  }
}

export default Reportes;