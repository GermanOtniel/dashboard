import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import './evidencias.css';
import { getEvidences } from '../../Services/evidencias';

const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  }
};

class Evidencias extends Component {

  state={
    newMarca:{},
    fecha:"",
    newObj:{},
    evidencias:[],
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
  }
  componentWillMount(){
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
    this.setState({evidencias})
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
            label="EVIDENCIAS"
            labelPosition="before"
            primary={true}
            icon={<FontIcon className="material-icons" >map</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
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
              <TableHeaderColumn colSpan="6" tooltip="Super Header" style={{textAlign: 'center'}}>
                Marcas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn>Fecha de Creación</TableHeaderColumn>
              <TableHeaderColumn>Dinamica Perteneciente</TableHeaderColumn>
              <TableHeaderColumn>Estado</TableHeaderColumn>
              <TableHeaderColumn>Usuario</TableHeaderColumn>
              <TableHeaderColumn>Modalidad</TableHeaderColumn>
              <TableHeaderColumn>Revisar</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
          {/* value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) */}

            {this.state.evidencias.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
.map( (evidencia, index) => (
              <TableRow key={evidencia._id} data={evidencia}>
                <TableRowColumn>{evidencia.created_at}</TableRowColumn>
                <TableRowColumn>{evidencia.dinamica}</TableRowColumn>
                <TableRowColumn>{evidencia.status}</TableRowColumn>
                <TableRowColumn>{evidencia.creador}</TableRowColumn>
                <TableRowColumn>{evidencia.modalidad}</TableRowColumn>
                <TableRowColumn><Link to={`/evidencia/${evidencia._id}`}>Ver Detalle</Link></TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>

    </div>
    );
  }
}

export default Evidencias;