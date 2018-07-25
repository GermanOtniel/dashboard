const baseURL = 'http://localhost:3000';

export function getEvidences(){
  return fetch( baseURL + '/evidencia/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(evidencias=>{
    return evidencias
  })
}
export function getSingleEvidence(id) {
  return fetch( baseURL + '/evidencia/' + id)
  .then(r=>r.json())
  .then(dinamic=>{
    return dinamic
  })
}
export function sendEvidencia(evidence,id){
  return fetch(baseURL + '/evidencia/evi/' + id , {
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(evidence)
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(evidencia=>{
      return evidencia;
  });
}
