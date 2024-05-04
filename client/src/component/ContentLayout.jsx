import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

async function getuser(url, method, todo){
    fetch(url, {
        method: method,
        mode:"cors",
        credentials:"include",
        headers: {
            "Content-Type": "application/json",
            "withCredentials":"true"
        },
    })
    .then(response => {
      return{
        status:response.status,
        promise:response.json()
      }
    }) 
    .then(data => {todo(data)})
}

async function logout(todo){
    fetch("http://localhost:1234/api/users/logout", {
        method: "DELETE",
        mode:"cors",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
          "withCredentials":"true"
        },
      })
      .then(response => response.text()) 
      .then(data => {todo(data)});
  }
  
  function ContentLayout(){
    const[user, setuser] = useState({
      username:"test",
      email:"test@mail.com"
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        getuser(
            "http://localhost:1234/api/users/current", 
            "GET",
            ((obj)=>{
                obj.promise.then((res)=>{
                  //console.log(`status:: ${res.data.email}`);
                  setuser(prevState =>{
                    return { 
                    ...prevState, 
                    username:res.data.username, 
                    email:res.data.email
                    }
                  });
                })
            })
        );
    }, []);
  
    return(
      <>
        <section className='form_section'>
          <div className='container fn'>
            <div className='user name'>
              <p>username : {user.username}</p>
            </div>
            <div className='user email'>
              <p>email : {user.email}</p>
            </div>
            <div className='conf'>
              <Link className='link edit fn' to='/edit'>
                <button>edit user</button>
              </Link>
              
              <button onClick={(e)=>{
                e.preventDefault();
                navigate('/delete');
              }} className='edit'>delete user</button>
  
              <button onClick={(e)=>{
                e.preventDefault();
                logout(()=>{navigate('/');});
              }} className='edit'>log out</button>
            </div>
          </div>
        </section>
      </>
    )
  }

  export default ContentLayout;