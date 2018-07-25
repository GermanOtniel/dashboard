const baseURL = 'http://localhost:3000';

export function zoneById(id) {
   return fetch( baseURL + '/zona/one' )
  .then(r=>r.json())
  .then(zona=>{
    return zona
  })
}
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