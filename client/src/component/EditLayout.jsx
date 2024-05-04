import { useState } from 'react'
import {  Link, useNavigate } from 'react-router-dom'

function edit(url,method,body,todo){  
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

function EditLayout(){
    const[user, setuser] = useState({
      username:""
    });
    const navigate = useNavigate();
    const body = {
        username:user.username
    };
    const[display, setdisplay] = useState("none");

    return (
      <>
        <section className='form_section'>
        <form onSubmit={(e)=>{
            e.preventDefault();
            edit(
                "http://localhost:1234/api/users/current",
                "PATCH",
                body,
                ((obj)=>{
                  if(obj.status == 200)
                    navigate("/content");
                  else 
                    setdisplay("block");
                })
            );
          }}>
            <label className='username label fn'>
              <span>old username:</span>
              <input type="text" value='' disabled/>
            </label>
  
            <label className='username label fn'>
              <span>new username:</span>
              <input type="text" placeholder='new username' required 
              onChange={(e)=>{setuser(prevState =>{return { ...prevState, username:e.target.value}})}}/>
            </label>
  
            <button type='submit' className='fn'>
              Submit
            </button>

            <label style={{display:display}} className='error label fn'>
              <span>username already exist!</span>
            </label>
          </form>
          <div className='edit_nav'>
            <Link className='fn' to='/content'>back</Link>
          </div>
        </section>
      </>
    )
  }
  
  

export default EditLayout;