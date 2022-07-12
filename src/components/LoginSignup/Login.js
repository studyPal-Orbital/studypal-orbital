import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import loginImg from "../img/bg.png";
import './LoginSignup.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = UserAuth();

  /* Submit & confirm the validity of user log in inputs */ 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password)
      navigate('/home')
    } catch (e) {
      if (e.message == "Firebase: Error (auth/user-not-found).") {
        setError("You do not have a registered account")
      } else if (e.message == "Firebase: Error (auth/wrong-password).") {
        setError("You have entered the wrong password")
      } else {
        setError("Your login credentials are inaccurate")
      }
      console.log(e.message)
    }
  }

  return (
  <div id='login-container'>
      <div id="login-credentials-container">
        <div id="login-text-desc-container">
          <h1>Log in</h1>
          <p>
            Don't have an account yet?{' '}
            <Link to='/signup'>Sign up</Link>
          </p>
          {setError != '' && <p id="login-error">{error}</p>}
        </div>
        <form id='login-form' onSubmit={handleSubmit}>
          <div className='login-label-container'>
            <label className='login-label'>Email </label>
            <input className='login-input' 
                   onChange={(e) => setEmail(e.target.value)} 
                   type='email' 
            />
          </div>
          <div className='login-label-container'>
            <label className='login-label'>Password</label>
            <input className='login-input' onChange={(e) => setPassword(e.target.value)} type='password' />
          </div>
          <div>
          <button className='login-button'>Log In</button>
            <p><Link to='/'>Home</Link></p>
          </div>
        </form>
      </div>
      <div id='login-img-container'>
        <img id='login-img' src={loginImg} />
      </div>
    </div>
  )
}

export default Login;
