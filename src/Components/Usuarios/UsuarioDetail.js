import React, {Component} from 'react';
import Dash from '../Dash/Dashboard';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import { getUser, editUser } from '../../Services/authDash';
import { getBrands } from '../../Services/brands';
import './usuarios.css';



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
  }
};

class UsuarioDetail extends Component{

  state={
    user:{},
    open:false,
    opciones:['SUPERADMIN','GERENTE', 'CHECKTICKET','SUPERVISOR','EMBAJADOR','USER'],
    brands:[]
  }

  componentWillMount(){
     let id = this.props.match.params.id
    getUser(id)
    .then(user=>{
      console.log(user)
      this.setState({user})
    })
    .catch(e=>alert(e));
    getBrands()
     .then(brands=>{
    this.setState({brands})
     })
     .catch(e=>console.log(e))
  }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  onNewRequest = (chosenRequest) => {
    console.log(chosenRequest)
    let { user } = this.state;
    user.puesto = chosenRequest;
    this.setState({user})
  }
  onNewRequestBrand = (chosenRequest) => {
    const {user} = this.state;
    user.brand =  chosenRequest;
    this.setState({user});
  }
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
      return (
        <div>
          <Dash/>
          <div className="userPadreDetail">
          <Paper style={style} >
          <RaisedButton labelColor="#FAFAFA" backgroundColor="#37474F" label="DETALLE DE USUARIO" fullWidth={true} />
          <div className="userPadreDetail">
            <div>
            <img width="500px" height="500px" src={user.fotoPerfil ? user.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Fuser.png?alt=media&token=a2e1fe21-da40-43ed-bcd7-09d63e53e8a7"}/>
            </div>
            <div className="userSonDetail">
              <u>Correo del Usuario: </u><h4>{user.correo}</h4>
              <u>Puesto Actual: </u><h4>{user.puesto}</h4>
              <u>Fecha de Registro: </u><h4>{user.created_at}</h4>                                              
              <RaisedButton label="Editar Usuario" primary={true} onClick={this.handleOpen} />
            </div>

          </div>
            
          </Paper>
          </div>
          <div>
          <Dialog
            title="Editar Usuario"
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
           <AutoComplete
             floatingLabelText="Type 'r', case insensitive"
             filter={AutoComplete.caseInsensitiveFilter}
             dataSource={this.state.brands.map(brand => brand)}
             dataSourceConfig={ {text: 'nombre', value: '_id'}  }
             onNewRequest={this.onNewRequestBrand}
             style={styles.autoComplete}
            />            
          <Divider />
          <AutoComplete
             floatingLabelText="Type 'r', case insensitive"
             filter={AutoComplete.caseInsensitiveFilter}
             dataSource={this.state.opciones.map(opcion => opcion)}
             onNewRequest={this.onNewRequest}
             style={styles.autoComplete}
             /*style={!this.state.centroConsumo ? styles.autoComplete : styles.autoHidden }*/
            /> 
    
          <RaisedButton onClick={this.sendEdit}  label="Enviar Cambios" secondary={true}  />
          
        </Dialog> 
         </div>
        </div>
      );
    }
    
  }

  

export default UsuarioDetail;