import React from 'react'
import { useState } from 'react'
import "../auth.form.scss"
import { useNavigate,Link } from "react-router-dom"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const {loading,handleLogin} = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  
  const navigate = useNavigate();
  const handleSubmit = async(e)=>{
    e.preventDefault();
    await handleLogin({email,password});
    navigate("/");
  }
  if(loading){
    return <main><h1>Loading...</h1></main>
  }
  return (

    <main>
      <div className='form-container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} />
        <input type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} />
        <button className='button' type="submit">Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
    </main>
  )
}

export default Login