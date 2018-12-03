// production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

//CREO QUE NO SIRVE PARA NADA 
export function zoneById(id) {
   return fetch( baseURL + '/zona/one' )
  .then(r=>r.json())
  .then(zona=>{
    return zona
  })
}
// REPITO CREO QUE NO SIRVE PARA NADA

//SE UTILIZA EN EL COMPONENTE DE DINAMICAS
export function createDinamic(formulario){
  return fetch(  baseURL + '/dinamica/new' ,{
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
  .then(dinamica=>{
    return dinamica
  })
}

//SE UTILIZA EN EL COMPONENTE DE DINAMICAS PARA EDITAR UNA DINAMICA

export function sendChangesDinamic(id,newDinamic){
  return fetch(  baseURL + '/dinamica/edit/'+ id ,{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newDinamic)
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(dinamica=>{
    return dinamica
  })
}

//SE UTILIZA EN EL COMPONENTE DE DINAMICAS
export function getDinamics(){
  return fetch( baseURL + '/dinamica/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(dinamicas=>{
    return dinamicas
  })
}

//DINAMICAS POR BRAND 
export function getDinamicsByBrand(id){
  return fetch( baseURL + '/dinamica/dash/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(dinamicas=>{
    return dinamicas
  })
}

export function getSingleDinamic(id) {
  return fetch( baseURL + '/dinamica/' + id)
  .then(r=>r.json())
  .then(dinamic=>{
    return dinamic
  })
}

//SE UTILIZA EN el componente de DINAMICA DETAIL PARA HACER A UN USUARIO GANADOR POR BUENAS VENTAS
export function makeWinner(user,id){
  return fetch(baseURL + '/dinamica/winnerdash/' + id , {
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(dinamica=>{
      return dinamica;
  });
}

//SEUTILIA EN EL COMPONENTE DE DINAMICAS PARA BORRAR UNA DINAMICA

export function deleteDinamic(id){
  return fetch(baseURL + '/dinamica/delete/' + id , {
      method:'delete',
      headers:{
          "Content-Type": "application/json"
      }
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(dinamica=>{
      return dinamica;
  });
}

//DINAMICAS POR BRAND PARA TRAER LOS CENTROS EN DONDE TIENEN DINAMICAS Y SALGAN LOS USUARIOS DE ESOS CENTROS
export function getUsersByDinamics(id){
  return fetch( baseURL + '/dinamica/dashdinacentusers/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(dinamicas=>{
    return dinamicas
  })
}