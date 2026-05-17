import React,{useState} from 'react'
import { useNavigate,Link } from "react-router-dom"
import {useAuth} from '../hooks/useAuth'
const Register = () => {
  const {loading,handleRegister} = useAuth();
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({username,email,password})
    navigate("/");

  }
  if(loading){
    return <main><h1>Loading...</h1></main>
  }
  return (
    <main>
      <div className='form-container'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" onChange={(e)=>{setUsername(e.target.value)}} />
          <input type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} />
          <input type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} />
          <button className='button' type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register