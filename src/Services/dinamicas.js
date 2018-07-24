const baseURL = 'http://localhost:3000';

export function zoneById(id) {
  
  return fetch( baseURL + '/zona/one' )
  .then(r=>r.json())
  .then(zona=>{
    return zona
  })
}