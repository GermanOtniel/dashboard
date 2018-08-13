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
    this.setState({evidencias,evidenciasFilter:evidencias})
     })
     .catch(e=>console.log(e))
   }

   filterList = (e) =>{
    var updatedList = this.state.evidencias.map(evidencia=>evidencia);
    updatedList = updatedList.map(evidencia=>evidencia).filter(function(item){
      return item.dinamica.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
    });
    this.setState({evidenciasFilter: updatedList})
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
        <input placeholder="Evidencias por Dinámica" type="text" onChange={this.filterList}/>
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
          >
          {/* value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) */}

            {this.state.evidenciasFilter.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
.map( (evidencia, index) => (
              <TableRow key={evidencia._id} data={evidencia}>
                <TableRowColumn>{evidencia.created_at}</TableRowColumn>
                <TableRowColumn>{evidencia.dinamica}</TableRowColumn>
                <TableRowColumn>{evidencia.status}</TableRowColumn>
                <TableRowColumn>{evidencia.creador}</TableRowColumn>
                <TableRowColumn>{evidencia.modalidad}</TableRowColumn>
                <TableRowColumn><Link to={`/evidencia/${evidencia._id}`}><button className="buttonDinamicasDetalle">Ver Detalle</button></Link></TableRowColumn>

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