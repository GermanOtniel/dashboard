// production 
const baseURL = process.env.REACT_APP_BASE_URL;
// development
//const baseURL = "http://localhost:3000"

//SE USA EN EL COMPONENTE DE {{{{{{{REPORTE PARA TRAER EL CENTRO DE CONSUMO DE UN USUARIO}}}}}}}
export function getCenter(id){
  return fetch( baseURL + '/ctrconsumo/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(center=>{
    return center
  })
}

export function getUsersByCenter(id){
  return fetch(baseURL + '/ctrconsumo/users/' + id)
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(users=>{
    return users
  })
}