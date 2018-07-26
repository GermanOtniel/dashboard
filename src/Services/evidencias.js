const baseURL = 'http://localhost:3000';


//SE UTILIZA EN EL COMPONENTE DE {{{{{{{EVIDENCIAS}}}}}}}
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

//SE UTILIZA EN EL COMPONENTE DE {{{{{{{EVIDENCIA_DETAIL}}}}}}}
export function getSingleEvidence(id) {
  return fetch( baseURL + '/evidencia/' + id)
  .then(r=>r.json())
  .then(dinamic=>{
    return dinamic
  })
}
//SE UTILIZA EN EL COMPONENTE DE {{{{{{{EVIDENCIA_DETAIL}}}}}}}
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
