const baseURL = process.env.REACT_APP_BASE_URL;

//SE USA EN EL COMPONENTE DE BRANDS {{{{{BRANDS}}}}}
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
//SE USA EN EL COMPONENTE DE BRANDS {{{{{BRANDS}}}}}

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
//SE UTILIZA EN EL COMPONENTE DE {{{{DINAMICAS}}}} 
export function getSingleBrand(id){
  return fetch( baseURL + '/brand/'+ id )
  .then(brand=>{
    return brand
  })
  .catch(e=>console.log(e))
}
export function getBrand(id){
  return fetch( baseURL + '/brand/' + id )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(brand=>{
    return brand
  })
}