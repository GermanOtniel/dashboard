// production 
const baseURL = process.env.REACT_APP_BASE_URL;
// development
//const baseURL = "http://localhost:3000"

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

// esta se usa para traer las evidencias de una dinamica, para aprobarlas o desaprobarlas.
export function getAllEvidencesByDinamica(id){
  return fetch( baseURL + '/evidencia/all/dash/' + id)
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(evidencias=>{
    return evidencias
  })
}

// esta se usa para traer las evidencias de una dinamica, para aprobarlas o desaprobarlas.
export function getEvidencesByDinamica(id,status){
  return fetch( baseURL + '/evidencia/dash/' + id + '?status=' + status)
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

export function getEvidencesByDinamic(id) {
  return fetch( baseURL + '/evidencia/dinamica/' + id)
  .then(r=>r.json())
  .then(evidencias=>{
    return evidencias
  })
}

export function getEvidencesByDinamicAndByDate(id,fechasArray){
  return fetch(baseURL + '/evidencia/dinamica/date/' + id + '?fechas=' + fechasArray, {
    method:'GET',
    headers:{
        "Content-Type": "application/json"
    }
})
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(evidencias=>{
      return evidencias;
  });
}

//SEUTILIA EN EL COMPONENTE DE EVIDENCIAS PARA BORRAR UNA EVIDENCIA

export function deleteEvidence(id){
  return fetch(baseURL + '/evidencia/delete/' + id , {
      method:'delete',
      headers:{
          "Content-Type": "application/json"
      }
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(r=>{
      return r;
  });
}
