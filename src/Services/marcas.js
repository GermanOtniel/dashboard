const baseURL = 'http://localhost:3000';
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

//CREO QUE NO SIRVE PARA NADA REPITO PARA {{{{{{ NADA }}}}}}
export function getMarcasByBrand(){
  //console.log("peticion");
  //  localhost  
  // herokuapp  '/auth/profile/'
  return fetch( baseURL + '/marca/bybrand' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(marcas=>{
    return marcas
  })
}
//CREO QUE NO SIRVE PARA NADA REPITO PARA {{{{{{ NADA }}}}}}
