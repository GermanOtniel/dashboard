import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { getCountry, createState, getStates, createZone, getZonas } from '../../Services/pez';
import './zonas.css';

const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  }
};

class Zonas extends Component {

  state={
    open:false,
    open2:false,
    country:[],
    newState:{},
    estados:[],
    newZone:{},
    zonas:[],
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
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };
  componentWillMount(){
  getZonas()
   .then(zonas=>{
  var zonass =  zonas.map(zona=> zona.estado.nombre);
  for(let i= 0; i < zonas.length;i++) 
    {
      zonas[i].estado = zonass[i]
    }
     this.setState({zonas})
   })
   .catch(e=>alert(e))
  getCountry()
   .then(country=>{
     this.setState({country})
   })
   .catch(e=>alert(e))
   getStates()
   .then(estados=>{
     this.setState({estados})
   })
   .catch(e=>alert(e))
 }
 onNewRequest = (chosenRequest) => {
  const {newState} = this.state;
  newState.pais =  chosenRequest;
  this.setState({newState});
}
onNewRequest2 = (chosenRequest) => {
  const {newZone} = this.state;
  newZone.estado =  chosenRequest;
  this.setState({newZone});
}
onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newState} = this.state;
  newState[field] = value;
  console.log(newState)
  this.setState({newState}); 
}
onChange2 = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newZone} = this.state;
  newZone[field] = value;
  console.log(newZone)
  this.setState({newZone}); 
}
  sendEdit = (e) => {
    const estado = this.state.newState;
    createState(estado)
    .then(state=>{
      console.log(state)
      this.componentWillMount();
      this.setState({open:false})

    })
    .catch(e=>console.log(e))
  }
  sendZona = (e) => {
    const zona = this.state.newZone;
    createZone(zona)
    .then(zona=>{
      console.log(zona)
      this.componentWillMount();
      this.setState({open2:false})

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
            label="CREA UN ESTADO"
            labelPosition="before"
            primary={true}
            icon={<FontIcon className="material-icons" >map</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
          /> 
         </div>
         <div>
          <RaisedButton
            label="CREA UNA ZONA"
            labelPosition="before"
            primary={true}
            icon={<FontIcon className="material-icons" >place</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen2}
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
              <TableHeaderColumn colSpan="4" tooltip="Super Header" style={{textAlign: 'center'}}>
                Zonas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Zona</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Estado</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status">Editar</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.zonas.sort((a, b) => a.nombre !== b.nombre ? a.nombre < b.nombre ? -1 : 1 : 0)
.map( (zona, index) => (
              <TableRow key={zona._id} data={zona}>
                <TableRowColumn>{zona._id}</TableRowColumn>
                <TableRowColumn>{zona.nombre}</TableRowColumn>
                <TableRowColumn>{zona.estado}</TableRowColumn>
                <TableRowColumn>Editar</TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
          <Dialog
            title="Crea un estado"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
          <Paper  zDepth={2}>
          <AutoComplete
            floatingLabelText="Selecciona el país"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.country.map(country => country)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest}
          />            
          <Divider />
            <TextField onChange={this.onChange} name="nombre" hintText="Nombre del Estado" type="text"  underlineShow={false} />
            <Divider />
    </Paper>
          <RaisedButton onClick={this.sendEdit}  label="Crear Estado" secondary={true}  />
          
        </Dialog> 
         </div>
         <div>
          <Dialog
            title="Crea una Zona"
            modal={false}
            open={this.state.open2}
            onRequestClose={this.handleClose2}
          >
          <Paper  zDepth={2}>
          <AutoComplete
            floatingLabelText="Selecciona el estado"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.estados.map(state => state)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest2}
          />            
          <Divider />
            <TextField onChange={this.onChange2} name="nombre" hintText="Nombre de la Zona" type="text"  underlineShow={false} />
            <Divider />
    </Paper>
          <RaisedButton onClick={this.sendZona}  label="Crear Zona" secondary={true}  />
          
        </Dialog> 
         </div>
    </div>
    );
  }
}

export default Zonas;