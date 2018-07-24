const baseURL = 'http://localhost:3000';

export function createBrand(formulario){
  return fetch(  baseURL + '/brand/new' ,{
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
  .then(brand=>{
    return brand
  })
}
export function getBrands(){
  //console.log("peticion");
  //  localhost  
  // herokuapp  '/auth/profile/'
  return fetch( baseURL + '/brand/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(brands=>{
    return brands
  })
}
export function getSingleBrand(id){
  return fetch( baseURL + '/brand/'+ id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(brand=>{
    return brand
  })
}