import React, {Component} from 'react';
import Dash from '../Dash/Dashboard';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import {green700,blue500} from 'material-ui/styles/colors';
import { getUser, editUser } from '../../Services/authDash';
import { getBrands } from '../../Services/brands';



const style = {
  height: '100%',
  width: '80%',
  margin: 40,
  textAlign: 'center',
  display: 'inline-block'
};
const styles = {
 
  autoComplete: {
    display: 'block'
  },
  autoHidden: {
    display: 'none'
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  }
};

class UsuarioDetail extends Component{

  state={
    user:{},
    open:false,
    opciones:['SUPERADMIN','GERENTE', 'CHECKTICKET','SUPERVISOR','EMBAJADOR','USER'],
    brands:[]
  }

  // ESTA VISTA SOLO ESTA DISPONIBLE PARA LOS SUPERADMINS O LOS QUE SON DEL BRAND DE 1PUNTOCINCO QUE ES LO MISMO
  // TRAEMOS AL USUARIO ELEGIDO Y TRAEMOS TODOS LOS BRANDS PORQUE VAMOS A ASIGNARLE UN BRAND
  componentWillMount(){
     let id = this.props.match.params.id
    getUser(id)
    .then(user=>{
      this.setState({user})
    })
    .catch(e=>alert(e));
    getBrands()
     .then(brands=>{
    this.setState({brands})
     })
     .catch(e=>console.log(e))
  }

// ABRIR Y CERRAR DIALOGO PARA EDITAR UN USUARIO
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };


// ELEGIR QUE PUESTO VA A TENER DENTRO DE SU ORGANIZACIÓN UN USUARIO
  onNewRequest = (chosenRequest) => {
    let { user } = this.state;
    user.puesto = chosenRequest;
    this.setState({user})
  }

// ASIGNARLE UN BRAND A UN USUARIO
  onNewRequestBrand = (chosenRequest) => {
    const {user} = this.state;
    user.brand =  chosenRequest;
    this.setState({user});
  }

// ENVIAR LOS CAMBIOS  ANUESTRO BACKEND MEDIANTE EL SERVICIO editUser 
  sendEdit = (e) => {
    const id = this.props.match.params.id;
    const {user} = this.state;
    editUser(user,id)
    .then(user=>{
      this.handleClose();
      this.props.history.push('/usuarios')
    })
    .catch(e=>console.log(e)) 
  }

  render(){
    const {user} = this.state;
    const actions = [
      <RaisedButton 
      onClick={this.sendEdit}  
      label="Enviar Cambios" 
      backgroundColor="#0D47A1"
      labelColor="#FAFAFA" 
      />
    ]
      return (
        <div>
          <Dash/>
          <div className="userPadreDetail">
          <Paper style={style} >
          <RaisedButton labelColor="#FAFAFA" backgroundColor="#37474F" label="DETALLE DE USUARIO" fullWidth={true} />
          <div className="userPadreDetail">
            <div>
            <img alt="Imagen Usuario" className="imagenUserDetailResponsive" src={user.fotoPerfil ? user.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Ffoto-no-disponible.jpg?alt=media&token=c8c0d7a0-d1f2-418a-89d1-9d7688d0e801"}/>
            </div>
            <div className="userSonDetailResponsive">
              <u>Correo del Usuario: </u><h4>{user.correo}</h4>
              <u>Puesto Actual: </u><h4>{user.puesto}</h4>
              <u>Fecha de Registro: </u><h4>{user.created_at}</h4>                                              
              <RaisedButton   
                label="Editar" 
                backgroundColor="#0D47A1"
                labelColor="#FAFAFA" 
                onClick={this.handleOpen} 
              />
            </div>
          </div>
          </Paper>
          </div>
          <div>
          <Dialog
            title="Editar Usuario"
            modal={false}
            actions={actions}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
           <AutoComplete
             floatingLabelText="Asignale su BRAND"
             filter={AutoComplete.caseInsensitiveFilter}
             dataSource={this.state.brands.map(brand => brand)}
             dataSourceConfig={ {text: 'nombre', value: '_id'}  }
             onNewRequest={this.onNewRequestBrand}
             style={styles.autoComplete}
             openOnFocus={true}
             floatingLabelStyle={styles.floatingLabelFocusStyle}
             floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
             errorText="Este campo es obligatorio"
             errorStyle={styles.errorStyle}
            />            
          <Divider />
          <AutoComplete
             floatingLabelText="Asignale su puesto"
             hintText="Asegúrate primero"
             filter={AutoComplete.caseInsensitiveFilter}
             dataSource={this.state.opciones.map(opcion => opcion)}
             onNewRequest={this.onNewRequest}
             style={styles.autoComplete}
             openOnFocus={true}
             floatingLabelStyle={styles.floatingLabelFocusStyle}
             floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
             errorText="Este campo es obligatorio"
             errorStyle={styles.errorStyle}
            /> 
        </Dialog> 
         </div>
        </div>
      );
    }
  }

export default UsuarioDetail;