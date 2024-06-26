import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function login(url,method,body,todo){  
    fetch(url, {
        method: method,
        mode:"cors",
        credentials:"include",
        headers: {
            "Content-Type": "application/json",
            "withCredentials":"true"
        },
        body: JSON.stringify(body)
    })
    .then(response => {
      return{
        status:response.status,
        promise:response.json()
      }
    }) 
    .then(data => {todo(data)});
}

function LoginLayout(){
    const[user, setuser] = useState({
      email:"",
      password:""
    });
    const navigate = useNavigate();
    const body = {
        email:user.email,
        password:user.password
    }
    const[display, setdisplay] = useState("none");

    return (
      <>
        <section className='form_section'>
          <form onSubmit={(e)=>{
            e.preventDefault();
            login(
                "http://localhost:1234/api/users/login",
                "POST",
                body,
                ((obj)=>{
                  if(obj.status == 200)
                    navigate("/content");
                  else 
                    setdisplay("block");
                })
            );
            
          }}>
            <label className='email label fn'>
              <span>email:</span>
              <input type="email" placeholder='example@mail.com' required 
              onChange={(e)=>{setuser(prevState =>{return { ...prevState, email:e.target.value}})}}/>
            </label>
  
            <label className='password label fn'>
              <span>password:</span>
              <input type="password" placeholder='password' required
              onChange={(e)=>{setuser(prevState =>{return { ...prevState, password:e.target.value}})}}/>
            </label>
  
            <button type='submit' className='fn'>Login</button>
          
            <label style={{display:display}} className='error label fn'>
              <span>user not exist!</span>
            </label>
          </form>
          <div className='reg_nav'>
            <Link className='fn' to='/register'>register</Link>
          </div>
        </section>
      </>
    )
}

export default LoginLayout;