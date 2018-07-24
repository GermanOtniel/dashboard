const baseURL = 'http://localhost:3000';

export function signup(userData){
  // localhost 
  //herokuapp '/auth/signup'
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
export function login(userData){
  //  localhost 
  // herokuapp  '/auth/login'
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

  export function getUser(id){
    //console.log("peticion");
    //  localhost  
    // herokuapp  '/auth/profile/'
    return fetch( baseURL + '/auth/profile/' + id )
    .then(res=>{
      if(!res.ok) return Promise.reject(res.statusText);
      return res.json()
    })
    .then(user=>{
      return user
    })
  }