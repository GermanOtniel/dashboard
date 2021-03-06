// production 
//const baseURL = process.env.REACT_APP_BASE_URL;
// development
const baseURL = "http://localhost:3000"

//SE USA EN EL COMPONENTE DE {{{{{{{{{SIGNUP}}}}}}}}}
export function signup(userData){
    return fetch( baseURL + '/dash/signup', {
        method:'post',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res=>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
    })
    .then(user=>{
        localStorage.setItem('user', JSON.stringify(user))
        return user;
    });
}
//SE USA EN EL COMPONENTE DE {{{{{{LOGIN}}}}}}
export function login(userData){
    return fetch( baseURL + '/dash/login' ,{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(userData),
      credentials: "include"
    })
    .then(res=>{
      if(!res.ok) return Promise.reject(res)
      return res.json();
    })
    .then(user=>{
      localStorage.setItem('user',JSON.stringify(user));
      return user;
    })
  }
//SE USA EN EL COMPONENTE DE {{{{{{{DINAMICAS}}}}}}}
  export function getUser(id){
    return fetch( baseURL + '/dash/profile/' + id )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(user=>{
      return user
    })
  }

  export function editUser(user,id){
    return fetch( baseURL + '/dash/user/' + id,{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(user)
    })
    .then(res=>{
      if(!res.ok) return Promise.reject(res);
      return res.json();
    })
    .then(user=>{
      return user;
    });
  }

  export function outUserDash(){
    return fetch( baseURL + '/dash/logout' )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return 
    })
    .then(logoutUser=>{
      return 'Saliste'
    })
  }

  // RECUPERAR CONTRASEÑA
  export function getNewPasswordDash(correo){
    return fetch(  baseURL + '/dash/password/',{
      method:'post',
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify(correo),
    })
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(user=>{
      return user
    })
  }

  // CAMBIAR CONTRASEÑA
export function changePasswordDash(body){
  return fetch(  baseURL + '/dash/password/dash',{
    method:'post',
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    credentials:"include"
})
  .then(res=>{
    if(!res.ok) return Promise.reject(res.statusText);
    return res.json()
  })
  .then(user=>{
    return user
  })
}