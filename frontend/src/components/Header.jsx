import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../features/auth/auth.context'
import {useAuth} from '../features/auth/hooks/useAuth'
import './header.scss'
const Header = () => {
    const context = useContext(AuthContext);
    const {user} = context
    const {handleLogout} = useAuth();
  return (
    
     <div className='header-container'>
        <div className="left">
            <h1>Intervu</h1>
        </div>
        <div className="right">
             {user &&<button  className='header-button  ' onClick={()=>handleLogout()}>Logout</button>}
        </div>
    </div>
    
  )
}

export default Header