// production 
const baseURL = process.env.REACT_APP_BASE_URL;
// development
//const baseURL = "http://localhost:3000"

//SE UTILIZA EN EL COMPONENTE DE {{{{{ CENTROS }}}}}
export function getZonas(){
  return fetch( baseURL + '/zona/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(zonas=>{
    return zonas
  })
}

//SE UTILIZA EN EL COMPONENTE DE {{{{{ ZONAS }}}}}
export function getCountry(){
  return fetch( baseURL + '/pais/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(paises=>{
    return paises
  })
}

//SE UTILIZA EN EL COMPONENTE DE {{{{{ ZONAS }}}}}
export function getStates(){
  return fetch( baseURL + '/estado/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(estados=>{
    return estados
  })
}

//SE UTILIZA EN EL COMPONENTE DE {{{{{ CENTROS }}}}}
export function getCenters(){
  return fetch( baseURL + '/ctrconsumo/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(centros=>{
    return centros
  })
}

//SE UTILIZA EN EL COMPONENTE DE {{{{{ CENTROS }}}}}
export function createCenter(formulario){
  return fetch(  baseURL + '/ctrconsumo/new' ,{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formulario)
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(centro=>{
    return centro
  })
}

//SE UTILIZA EN EL COMPONENTE DE {{{{{ ZONAS }}}}}
export function createState(formulario){
  return fetch(  baseURL + '/estado/new' ,{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formulario)
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(state=>{
    return state
  })
}

//SE UTILIZA EN EL COMPONENTE DE {{{{{ ZONAS }}}}}
export function createZone(formulario){
  return fetch(  baseURL + '/zona/new' ,{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formulario)
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(zona=>{
    return zona
  })
}