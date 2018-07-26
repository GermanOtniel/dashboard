const baseURL = 'http://localhost:3000';

//SE USA EN EL COMPONENTE DE {{{{{{{{{SIGNUP}}}}}}}}}
export function signup(userData){
    return fetch(baseURL + '/dash/signup', {
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
    return fetch( baseURL + '/auth/profile/' + id )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(user=>{
      return user
    })
  }