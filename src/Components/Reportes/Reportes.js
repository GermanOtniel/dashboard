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
    showCheckboxes: false,
    height: '300px',
    alReves:false,
    alReves2:false
  }

// SE MONTA EL COMPONENTE PERO SE HACE LA DISTINCION 
// SI EL USUARIO QUE ESTA GUARDADO EN EL LOCALSTORAGRE ES DEL BRAND DE 1PUNTOCINCO PUES VAS A TRAER INFORMACION GENERAL ES DECIR
//TRARERAS TODAS LAS DINAMICAS

// SI ERES UN USUARIO QUE NO ES DEL BRAND 1PUNTOCINCO PUES VAMOS A TRAERTE SOLO LAS DINAMICAS QUE CORRESPONDEN A TU BRAND
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
       dinamics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
        dinamics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
       this.setState({dinamicasFilter:dinamics,dinamics})
     })
     .catch(e=>console.log(e))
    } 
  }
// ES LA FUNCION PARA FILTRAR LAS DINAMICAS EN EL BUSCADOR, LAS BUSCA POR SU NOMBRE Y POR US MODALIDAD
   filterList = (e) =>{
    var updatedList = this.state.dinamics.map(dinamic=>dinamic);
    updatedList = updatedList.map(dinamic=>dinamic).filter(function(item){
      return item.nombreDinamica.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1 || item.modalidad.toLowerCase().search(
            e.target.value.toLowerCase()) !== -1;
    });
    this.setState({dinamicasFilter: updatedList})
  }

  // ES LA FUNCION PARA ORDENAR LAS DINAMICAS POR FECHA INICIAL
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
    // ES LA FUNCION PARA ORDENAR LAS DINAMICAS POR FECHA FINAL
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
       <br/><br/><br/>
       <div className="zona-container">
         <div>
          <RaisedButton
            label="REPORTES"
            labelPosition="before"
            labelColor="#FAFAFA"
            backgroundColor="#0D47A1"
            icon={<FontIcon className="material-icons">signal_cellular_alt</FontIcon>}
            labelStyle={{fontSize:'18px'}}
            className="crearDinamicaResponsive"
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
              <TableHeaderColumn colSpan="5" style={{textAlign: 'center'}}>
                Reportes de Dinámicas
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              {/* <TableHeaderColumn><h3>Modalidad</h3></TableHeaderColumn> 
              <TableHeaderColumn><h3>BRAND</h3></TableHeaderColumn> */}
              <TableHeaderColumn><h3>Nombre</h3></TableHeaderColumn>
              <TableHeaderColumn><h3>Status</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByFechai}>Inicia</h3></TableHeaderColumn>
              <TableHeaderColumn><h3 onClick={this.orderByFechaF}>Termina</h3></TableHeaderColumn>
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
                {/* <TableRowColumn>{dinamic.modalidad}</TableRowColumn>
                <TableRowColumn>{dinamic.brand}</TableRowColumn> */}
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