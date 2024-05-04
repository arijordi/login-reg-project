import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

async function register(url, method, body, todo){
    fetch(url, {
        method:method,
        headers: {
            "Content-Type": "application/json",
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

function RegisterLayout(){
    const[user, setuser] = useState({
      username:"",
      email:"",
      password:""
    });
    const navigate = useNavigate();
    const body = {
        username:user.username,
        email:user.email,
        password:user.password
    };
    const[display, setdisplay] = useState("none");
    
    return (
      <>
        <section className='form_section'>
          <form onSubmit={(e)=>{
                e.preventDefault();
                register(
                    "http://localhost:1234/api/users",
                    "POST",
                    body,
                    ((obj)=>{
                        /*obj.promise.then((res)=>{
                          console.log(`status:: ${res.data.email}`);
                        })*/
                        if(obj.status == 200)
                          navigate("/");
                        else 
                          setdisplay("block");
                    })
                );
            }}>
            <label className='username label fn'>
              <span>username:</span>
              <input type="text" placeholder='username' required 
              onChange={(e)=>{setuser(prevState =>{return { ...prevState, username:e.target.value}})}}/>
            </label>
  
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
  
            <button type='submit' className='fn'>
              register
            </button>

            <label style={{display:display}} className='error label fn'>
              <span>username or email already exist!</span>
            </label>
          </form>
          <div className='reg_nav'>
            <Link className='fn' to='/'>login</Link>
          </div>
        </section>
      </>
    )
  }

  export default RegisterLayout;