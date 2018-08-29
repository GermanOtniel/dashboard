import React, { Component } from 'react';
import Dash from '../Dash/Dashboard';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import AutoComplete from 'material-ui/AutoComplete';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';
import { getBrands,getBrandsById } from '../../Services/brands';
import { createMarca,getMarcas,getMarcasByBrand } from '../../Services/marcas';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import firebase from '../../firebase/firebase';
import './marcas.css';

const styles = {
  button: {
    margin: 12,
    width: 400,
    height:70
  }
};

const styles2 = {
  uploadButton: {
    verticalAlign: 'middle',
    color: '#FAFAFA'
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
class Marcas extends Component {

  state={
    open:false,
    open2:false,
    newMarca:{},
    fecha:"",
    newObj:{},
    brands:[],
    marcas:[],
    marcasFilter:[],
    detalleMarca:{},
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
    progresoImagen:0,
    botonMarca:true,
    alReves:false
  }
  componentWillMount(){
           //ID DEL BRAND
           const id = `${JSON.parse(localStorage.getItem('user')).brand}`;
           //ESTE ES EL SERVICIO PARA TRAER LAS DINAMICAS QUE EXISTEN Y REPRESENTARLAS EN LA TABLA
           if(id === "5b71bd925c65d40353ffda4c"){
            getBrands()
            .then(brands=>{
           this.setState({brands})
            })
            .catch(e=>console.log(e))
            getMarcas()
            .then(marcas=>{
             var marcass =  marcas.map(marca=> marca.brand.nombre);
             for(let i= 0; i < marcas.length;i++) 
               {
                 marcas[i].brand = marcass[i]
               }
               marcas.sort((a, b) => a.nombre.toLowerCase() !== b.nombre.toLowerCase() ? a.nombre.toLowerCase() < b.nombre.toLowerCase() ? -1 : 1 : 0)
              this.setState({marcasFilter:marcas,marcas})
            })
            .catch(e=>console.log(e))
           }
           else if (id !== "5b71bd925c65d40353ffda4c"){
            getBrandsById(id)
            .then(brands=>{
           this.setState({brands})
            })
            .catch(e=>console.log(e))
            getMarcasByBrand(id)
            .then(marcas=>{
             var marcass =  marcas.map(marca=> marca.brand.nombre);
             for(let i= 0; i < marcas.length;i++) 
               {
                 marcas[i].brand = marcass[i]
               }
               marcas.sort((a, b) => a.nombre.toLowerCase() !== b.nombre.toLowerCase() ? a.nombre.toLowerCase() < b.nombre.toLowerCase() ? -1 : 1 : 0)
               this.setState({marcasFilter:marcas,marcas})
            })
            .catch(e=>console.log(e))
           }
   }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,newObj:{},botonMarca:true});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };

  handleClose2 = () => {
    this.setState({open2: false});
  };
 
 onNewRequest = (chosenRequest) => {
  const {newMarca} = this.state;
  newMarca.brand =  chosenRequest;
  this.setState({newMarca,botonMarca:false});
}
onChange = (e) => {
  const field = e.target.name;
  const value = e.target.value;
  const {newMarca} = this.state;
  newMarca[field] = value;
  this.setState({newMarca}); 
}
getFile = e => {
  const file = e.target.files[0];
  const date = new Date();
  const date2 = String(date).slice(16,24)
  const numberRandom = Math.random();
  const number = String(numberRandom).slice(2,16)
  const child = 'marca' + date2 + number
  //aqui lo declaro
  const uploadTask = firebase.storage()
  .ref("marcas")
  .child(child)
  .put(file);
  //aqui agreggo el exito y el error
  uploadTask
  .then(r=>{
    const {newMarca} = this.state;
    newMarca.imagen =  r.downloadURL;
    this.setState({newMarca})
  })
  .catch(e=>console.log(e)) //task
  uploadTask.on('state_changed', (snap)=>{
    const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
    this.setState({progresoImagen});
  })
};
handleChange = (event, date) => {
  const {newMarca} = this.state;
  let fecha = String(date);
  newMarca.fechaAlta = fecha.slice(0,24);
  this.setState({newMarca});
  const {newObj} = this.state;
  newObj.fecha = date;
  this.setState({newObj});
};
sendMarca = (e) => {
createMarca(this.state.newMarca)
.then(marca=>{
  this.handleClose()
})
.catch(e=>console.log(e))
};
marca = (marca) => {
  this.handleOpen2()
  marca.fecha = marca.created_at.slice(0,10) 
  let {detalleMarca} = this.state;
  detalleMarca = marca;
  this.setState({detalleMarca})
  };
filterList = (e) =>{
  var updatedList = this.state.marcas.map(dinamic=>dinamic);
  updatedList = updatedList.map(marca=>marca).filter(function(item){
    return item.brand.toLowerCase().search(
      e.target.value.toLowerCase()) !== -1 || item.nombre.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
  });
  this.setState({marcasFilter: updatedList})
}
orderByMarca = (e) => {
  let {alReves} = this.state;
    if(alReves === false){
      let {marcasFilter} = this.state;
      marcasFilter.sort((a, b) => b.nombre.toLowerCase() !== a.nombre.toLowerCase() ? b.nombre.toLowerCase() < a.nombre.toLowerCase() ? -1 : 1 : 0)
      this.setState({marcasFilter,alReves:true})
    }
    else if(alReves === true){
      let {marcasFilter} = this.state;
      marcasFilter.sort((a, b) => a.nombre.toLowerCase() !== b.nombre.toLowerCase() ? a.nombre.toLowerCase() < b.nombre.toLowerCase() ? -1 : 1 : 0)
      this.setState({marcasFilter,alReves:false})
    }
}

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose2}
      />,
    ];
    const {detalleMarca} = this.state;
    return (
    <div>
       <Dash/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="CREA UNA MARCA"
            labelPosition="before"
            backgroundColor="#0D47A1"
            labelColor="#FAFAFA"
            icon={<FontIcon className="material-icons">assistant</FontIcon>}
            style={styles.button}
            labelStyle={{fontSize:'18px'}}
            onClick={this.handleOpen}
          /> 
         </div>
       </div>
       <div className="buscador">
         <span>Buscador: </span>
         <br/><br/>
        <input placeholder="Búsqueda por nombre" type="text" onChange={this.filterList}/>
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
                Marcas Existentes
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The Name"><h2 onClick={this.orderByMarca}>Marca</h2></TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name"><h2>Brand</h2></TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status"><h2>Fecha Alta</h2></TableHeaderColumn>
              <TableHeaderColumn tooltip="The Status"><h2>Editar</h2></TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
          >
            {this.state.marcasFilter.map( (marca, index) => (
              <TableRow key={marca._id} data={marca}>
                <TableRowColumn>{marca.nombre}</TableRowColumn>
                <TableRowColumn>{marca.brand}</TableRowColumn>
                <TableRowColumn>{marca.fechaAlta}</TableRowColumn>
                <TableRowColumn><button onClick={() => this.marca(marca)} className="buttonDinamicasDetalle">Ver Marca</button></TableRowColumn>

              </TableRow>
              ))}
          </TableBody>
        </Table>
       </div>
       <div>
          <Dialog
            title="Crea una Marca"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
                    
            <TextField 
              onChange={this.onChange} 
              name="nombre" 
              hintText="Nombre de la Marca" 
              type="text"  
              underlineShow={true} 
            />  
            <br/>
          <AutoComplete
            floatingLabelText="Selecciona Brand"
            filter={AutoComplete.caseInsensitiveFilter}
            multiLine={true}
            rows={1}
            dataSource={this.state.brands.map(brand => brand)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest}
          />  
          <br/>
          <DatePicker
            hintText="Fecha de Alta"
            value={this.state.newObj.fecha}
            onChange={this.handleChange}
          />
          <br/>
          <FlatButton
            label="Elige una Imagen"
            backgroundColor="#00897B"
            labelPosition="before"
            style={styles2.uploadButton}
            containerElement="label"
          > 
            <input onChange={this.getFile} name="imagen" type="file" style={styles2.uploadInput} />
          </FlatButton>
          <br/><br/>
          <LinearProgress mode="determinate" value={this.state.progresoImagen} />
          <span>{this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" : (this.state.progresoImagen > 0 && this.state.progresoImagen < 98 ? "Espera la imagen se está cargando..." : "La imagen tarda unos segundos en cargar")}</span>
          <br/><br/>
          
          
    
          <RaisedButton 
          onClick={this.sendMarca}  
          label="Crear Marca" 
          backgroundColor="#0D47A1"
          labelColor="#FAFAFA"  
          disabled={this.state.botonMarca}
          />
          
        </Dialog> 
         </div>
         <div>
          <Dialog
          title="Detalle de Marca"
          actions={actions}
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
          autoScrollBodyContent={true}
        >
        <img alt="Foto Marca" width="300px" height="250px" src={detalleMarca.imagen} />
        <br/><br/>
        <span>Nombre de la Marca: </span>
        <h3>{detalleMarca.nombre}</h3>  
        <span>Fecha de Creación: </span>
        <b>{detalleMarca.fecha}</b>  
        </Dialog>
          </div>
    </div>
    );
  }
}

export default Marcas;