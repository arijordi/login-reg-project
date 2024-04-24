import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'


function Reglayout(){
  const[user, setuser] = useState({
    username:"",
    email:"",
    password:""
  });

  return (
    <>
      <section className='form_section'>
        <form onSubmit={(e)=>{
          e.preventDefault();  

          const body = {
            username:user.username,
            email:user.email,
            password:user.password
          }

          fetch("http://localhost:1234/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body)
          })
          .then(response => response.text()) // Read response as text
          .then(data => console.log(data)); // Alert the response
          
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
        </form>
        <div className='reg_nav'>
          <Link className='fn' to='/'>login</Link>
        </div>
      </section>
    </>
  )
}

function LoginLayout(){
  const[user, setuser] = useState({
    email:"",
    password:""
  });

  return (
    <>
      <section className='form_section'>
        <form onSubmit={(e)=>{e.preventDefault;  
          alert(`username:${user.username}\npassword:${user.password}`);
          /*fetch POST
          fetch('https://www.example.com/submit-form', {
              method: 'POST', // Specify the HTTP method
              body: new FormData(document.querySelector('form')) // Collect form data
            })
          .then(response => response.text()) // Read response as text
          .then(data => alert(data)); // Alert the response
          */ 
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
        </form>
        <div className='reg_nav'>
          <Link className='fn' to='/register'>register</Link>
        </div>
      </section>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginLayout />} />
          <Route path="/register" element={<Reglayout />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
