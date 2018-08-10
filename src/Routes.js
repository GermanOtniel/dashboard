import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Login/Signup';
import Home from './Components/Home/Home';
import Zonas from './Components/Zonas/Zonas';
import Centros from './Components/Centros/Centros';
import Dinamicas from './Components/Dinamicas/Dinamicas';
import Brands from './Components/Brands/Brands';
import Marcas from './Components/Marcas/Marcas';
import Evidencias from './Components/Tickets/Evidencias';
import EvidenciaDetail from './Components/Tickets/EvidenciaDetail';
import Usuarios from './Components/Usuarios/Usuarios';
import UsuarioDetail from './Components/Usuarios/UsuarioDetail';
import Reportes from './Components/Reportes/Reportes';
import DinamicaDetail from './Components/Reportes/DinamicaDetail';


export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route  path="/signup" component={Signup}/>
      <Route  path="/home" component={Home}/>
      <Route  path="/zonas" component={Zonas}/>
      <Route  path="/centros" component={Centros}/>
      <Route  path="/dinamicas" component={Dinamicas}/>
      <Route  path="/brands" component={Brands}/>
      <Route  path="/marcas" component={Marcas}/>
      <Route  path="/tickets" component={Evidencias}/>
      <Route  path="/evidencia/:id" component={EvidenciaDetail}/>
      <Route  path="/usuarios" component={Usuarios}/>
      <Route  path="/usuario/:id" component={UsuarioDetail}/>
      <Route  path="/reportes" component={Reportes}/>
      <Route  path="/dinamica/:id" component={DinamicaDetail}/>
    </Switch>
  );
}