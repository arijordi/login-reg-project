import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function del(url,method,body,todo){  
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
    .then(response => response.text()) 
    .then(data => {todo(data)});
}


function DeleteLayout(){
    const[user, setuser] = useState({
      password:""
    });
    const navigate = useNavigate();
    const body = {
        password:user.password
    };

    return (
      <>
        <section className='form_section'>
          <form onSubmit={(e)=>{
                e.preventDefault();
                del(
                    "http://localhost:1234/api/users/current",
                    "DELETE",
                    body,
                    (()=>{
                        navigate("/");
                    })
                );
            }}>
            <label className='label fsh'>
              <span>DELETE CURRENT USER</span>
            </label>
  
            <label className='label fn'>
              <span>password:</span>
              <input type="text" placeholder='password' required 
              onChange={(e)=>{setuser(prevState =>{return { ...prevState, password:e.target.value}})}}/>
            </label>
  
            <button type='submit' className='fn'>Submit</button>
          </form>
          <div className='edit_nav'>
            <Link className='fn' to='/content'>back</Link>
          </div>
        </section>
      </>
    )
  }
export default DeleteLayout;