import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { outUserDash } from '../../Services/authDash';

const styleButtonOut = {
  marginLeft: 700,
  marginTop: 300
}

class Home extends Component {

  outUser = (e) => {
    outUserDash()
    .then(logoutUser=>{
      this.props.history.push("/");
    })
    .catch(e=>alert(e))
  }
  
  render() {
    return (
     <div>
       <div>
       <RaisedButton label="Salir" secondary={true} onClick={this.outUser} style={styleButtonOut}/>
       </div>
     </div>
    );
  }
}

export default Home;