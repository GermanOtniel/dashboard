import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Login/Signup';
import Home from './Components/Home/Home';
import Zonas from './Components/Zonas/Zonas';
import Pruebas from './Components/Pruebas';
import Centros from './Components/Centros/Centros';
import Dinamicas from './Components/Dinamicas/Dinamicas';
import Brands from './Components/Brands/Brands';
import Marcas from './Components/Marcas/Marcas';
import Evidencias from './Components/Tickets/Evidencias';
import EvidenciaDetail from './Components/Tickets/EvidenciaDetail';



export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route  path="/signup" component={Signup}/>
      <Route  path="/home" component={Home}/>
      <Route  path="/zonas" component={Zonas}/>
      <Route  path="/pruebas" component={Pruebas}/>
      <Route  path="/centros" component={Centros}/>
      <Route  path="/dinamicas" component={Dinamicas}/>
      <Route  path="/brands" component={Brands}/>
      <Route  path="/marcas" component={Marcas}/>
      <Route  path="/tickets" component={Evidencias}/>
      <Route  path="/evidencia/:id" component={EvidenciaDetail}/>
    </Switch>
  );
}