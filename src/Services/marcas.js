// production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

//SE UTILIZA EN EL COMPONENTE DE {{{{{{{MARCAS}}}}}}}
export function createMarca(formulario){
  return fetch(  baseURL + '/marca/new' ,{
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
  .then(marca=>{
    return marca
  })
}
//SE UTILIZA EN EL COMPONENTE DE {{{{{MARCAS}}}}}
export function getMarcas(){
  return fetch( baseURL + '/marca/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(marcas=>{
    return marcas
  })
}

//SE UTILIZA EN EL COMPONENTE DE {{{{{MARCAS}}}}} para traer LAS MARCAS DE UN USUARIO PERO POR SU BRAND
export function getMarcasByBrand(id){
  return fetch( baseURL + '/marca/dash/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(marcas=>{
    return marcas
  })
}

