import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate} from 'react-router-dom'
import './App.css'


let username='';


function Reglayout(){
  const[user, setuser] = useState({
    username:"",
    email:"",
    password:""
  });
  const navigate = useNavigate();

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
          navigate('/login');});
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
  const navigate = useNavigate();
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
              mode:"cors",
              credentials:"include",
              headers: {
                "Content-Type": "application/json",
                "withCredentials":"true"
              },
              body: JSON.stringify(body)
          })
          .then(response => response.text()) 
          .then(data => {
            console.log(data); 
            navigate('/content');
          });
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

/*
function gusername (uname){
  const[user, setuser] = useState('');

  if(uname)setuser(uname);

  return user;
}*/

function logout(navigate){
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
    .then(d => {
      const dparsed = JSON.parse(d);
      console.log(JSON.stringify(dparsed));
      navigate('/');
    });
}

function ContentLayout(){
  const[user, setuser] = useState({
    username:"test",
    email:"test@mail.com"
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:1234/api/users/current", {
      method: "GET",
      mode:"cors",
      credentials:"include",
      headers: {
        "Content-Type": "application/json",
        "withCredentials":"true"
      },
    })
    .then(response => response.text()) 
    .then(d => {
      const dparsed = JSON.parse(d);
      
      setuser(prevState =>{
        return { 
          ...prevState, 
          username:dparsed.data.username, 
          email:dparsed.data.email
        }
      });

      //gusername(dparsed.data.username);
      
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
            <Link className='link edit fn' to='/edit'>
              <button>edit user</button>
            </Link>
            
            <button onClick={(e)=>{
              e.preventDefault();
              navigate('/delete');
            }} className='edit'>delete user</button>

            <button onClick={(e)=>{
              e.preventDefault();
              logout(navigate);
            }} className='edit'>log out</button>
          </div>
        </div>
      </section>
    </>
  )
}

function Editlayout(){
  const[user, setuser] = useState({
    username:""
  });
  const navigate = useNavigate();
  return (
    <>
      <section className='form_section'>
        
        <form onSubmit={(e)=>{
          e.preventDefault();  

          const body = {
            username:user.username
          };
          
          fetch("http://localhost:1234/api/users/current", {
              method: "PATCH",
              credentials:"include",
              headers: {
                "Content-Type": "application/json",
                "withCredentials":"true",
              },
              body: JSON.stringify(body)
          })
          .then(response => response.text()) 
          .then(data => {
            console.log(data);
            navigate('/content');
          });
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
        </form>
        <div className='edit_nav'>
          <Link className='fn' to='/content'>back</Link>
        </div>
      </section>
    </>
  )
}



function DeleteLayout(){
  const[user, setuser] = useState({
    password:""
  });
  const navigate = useNavigate();
  return (
    <>
      <section className='form_section'>
        
        <form onSubmit={(e)=>{
          e.preventDefault();  

          const body = {
            password:user.password
          };
          
          fetch("http://localhost:1234/api/users/current", {
              method: "DELETE",
              credentials:"include",
              headers: {
                "Content-Type": "application/json",
                "withCredentials":"true",
              },
              body: JSON.stringify(body)
          })
          .then(response => response.text()) 
          .then(data => {
            console.log(data);
            navigate('/');
          });
          }}>

          <label className='label fsh'>
            <span>DELETE CURRENT USER</span>
          </label>

          <label className='label fn'>
            <span>password:</span>
            <input type="text" placeholder='password' required 
            onChange={(e)=>{setuser(prevState =>{return { ...prevState, password:e.target.value}})}}/>
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
          <Route path="/" element={<Navigate to="/login"/>} />
          <Route path="/login" element={<LoginLayout />} />
          <Route path="/register" element={<Reglayout />} />
          <Route path="/edit" element={<Editlayout />} />
          <Route path="/content" element={<ContentLayout />} />
          <Route path="/delete" element={<DeleteLayout />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
