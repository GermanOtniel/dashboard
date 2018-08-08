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
import { getZonas} from '../../Services/pez';
import { getDinamics } from '../../Services/dinamicas';
import { getBrand } from '../../Services/brands';
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
const styles2 = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const dataSource2 = [
  {text: "Activa",value:"Activa"},
  {text:"Inactiva",value:"Inactiva"}
]

class Reportes extends Component {

  state={
    open:false,
    newDinamic:{},
    dinamics:[],
    newObj:{},
    newObj2:{},
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
    //TRAEMOS EL BRAND PARA POPULAR SUS MARCAS Y TENER LAS MARCAS PARA EL AUTOCOMPLETE DE MARCAS
    getBrand(id)
      .then(brand=>{
        //console.log(brand)
        let {marcas} = this.state;
        marcas = brand.marcas
        this.setState({marcas})
      })
      .catch(e=>console.log(e))
    //TRAEMOS LAS ZONAS PARA TENER LAS ZONAS PARA EL AUTOCOMPLETE DE ZONAS
    getZonas()
     .then(zonas=>{
      this.setState({zonas})
     })
     .catch(e=>console.log(e))
     //ESTE ES EL SERVICIO PARA TRAER LAS DINAMICAS QUE EXISTEN Y REPRESENTARLAS EN LA TABLA
    getDinamics()
     .then(dinamics=>{
       //console.log(dinamics.map(dinamic => dinamic));
       let brands = dinamics.map(dinamic => dinamic.brand.nombre);
       for(let i= 0; i < dinamics.length;i++) 
        {
          dinamics[i].brand = brands[i]
        }
       this.setState({dinamics})
     })
     .catch(e=>console.log(e))
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
            primary={true}
            icon={<FontIcon className="material-icons">signal_cellular_alt</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
          /> 
         </div>
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
                Marcas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn>Modalidad</TableHeaderColumn>
              <TableHeaderColumn>BRAND</TableHeaderColumn>
              <TableHeaderColumn>Nombre</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Fecha de Inicio</TableHeaderColumn>
              <TableHeaderColumn>Fecha de Término</TableHeaderColumn>
              <TableHeaderColumn>Ver</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.dinamics.sort((a, b) => new Date(a.fechaFin) - new Date(b.fechaFin))
.map( (dinamic, index) => (
              <TableRow key={dinamic._id} data={dinamic}>
                <TableRowColumn>{dinamic.modalidad}</TableRowColumn>
                <TableRowColumn>{dinamic.brand}</TableRowColumn>
                <TableRowColumn>{dinamic.nombreDinamica}</TableRowColumn>
                <TableRowColumn>{dinamic.status}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaInicio.slice(0,10)}</TableRowColumn>
                <TableRowColumn>{dinamic.fechaFin.slice(0,10)}</TableRowColumn>
                <TableRowColumn><Link to={`/dinamica/${dinamic._id}`}>Ver Detalle</Link></TableRowColumn>

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