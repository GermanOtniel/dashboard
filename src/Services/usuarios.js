// production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

export function getUsers(){
  return fetch( baseURL + '/usuarios/' )
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(usuarios=>{
    return usuarios
  })
}

export function editHabilitiesOfUser(id,body){
  return fetch( baseURL + '/usuarios/edithabilities/' + id , {
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  })
  .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
  })
  .then(user=>{
      return user;
  });
}