import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import './App.css'


let username='';

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
          };

          fetch("http://localhost:1234/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
          })
          .then(response => response.text()) 
          .then(data => {console.log(data);
            window.location.href = 'http://localhost:3001/';});
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
        <form onSubmit={(e)=>{
          e.preventDefault();  

          const body = {
            email:user.email,
            password:user.password
          }

          fetch("http://localhost:1234/api/users/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(body)
          })
          .then(response => response.text()) 
          .then(data => console.log(data));
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

function ContentLayout(){
  const[user, setuser] = useState({
    username:"",
    email:""
  });

  useEffect(() => {
    fetch("http://localhost:1234/api/users/current", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization":"-"
        }
    })
    .then(response => response.text()) 
    .then(data => {
      
      setuser(prevState =>{
        return { 
          ...prevState, 
          username:data.username, 
          email:data.email
        }
      })

      username = data.username;

      console.log(data)
    });
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
            <Link className='link edit fn' to='/user/edit'>
              <button>edit user</button>
            </Link>
            
            <button className='edit'>delete user</button>
            <button className='edit'>log out</button>
          </div>
        </div>
      </section>
    </>
  )
}

function Editlayout(){

  return (
    <>
      <section className='form_section'>
        
        <form onSubmit={(e)=>{
          e.preventDefault();  

          const body = {
            username:username
          };
          
          fetch("http://localhost:1234/api/users/current", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization":"-"
              },
              body: JSON.stringify(body)
          })
          .then(response => response.text()) 
          .then(data => {
            console.log(data);
            window.location.href = 'http://localhost:3001/content';
          });
          }}>

          <label className='username label fn'>
            <span>old username:</span>
            <input type="text" value={username} disabled
            onChange={(e)=>{setuser(prevState =>{return { ...prevState, username:e.target.value}})}}/>
          </label>

          <label className='username label fn'>
            <span>new username:</span>
            <input type="text" placeholder='new username' required 
            onChange={(e)=>{setuser(prevState =>{return { ...prevState, username:e.target.value}})}}/>
          </label>

          <button type='submit' className='fn'>
            Submit
          </button>
        </form>
        <div className='edit_nav'>
          <Link className='fn' to='/content'>back</Link>
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
          <Route path="/user/edit" element={<Editlayout />} />
          <Route path="/content" element={<ContentLayout />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
