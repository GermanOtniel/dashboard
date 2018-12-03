// production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"



export function sendNote(cuerpo){
  return fetch(baseURL + '/nota/new' , {
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(cuerpo)
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(nota=>{
      return nota;
  });
}

export function getNotesByBrand(id){
    return fetch( baseURL + '/nota/bybrand/' + id )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(notas=>{
      return notas
    })
  }

  export function getAllNotes(){
    return fetch( baseURL + '/nota/' )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(notas=>{
      return notas
    })
  }
  
  export function deleteNote(id){
    return fetch(baseURL + '/nota/delete/' + id , {
        method:'delete',
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(nota=>{
        return nota;
    });
  }