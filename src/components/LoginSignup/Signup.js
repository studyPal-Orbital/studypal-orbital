import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'
import { getAuth, updateProfile } from "firebase/auth";
import signupImg from "../img/bg.png";
import './LoginSignup.css'

const auth = getAuth();

const Signup = () => {
    const [username, setUsername] = useState(' ')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [confirmPassword, setConfirmPassword] = useState("")


    const { createUser } = UserAuth() 
    const navigate = useNavigate()

    /* Submit & confirm the validity of user sign up inputs */ 
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (password.length <= 6) {
                setError(() => "Password should be at least 6 characters")
            } else {
                if (password != confirmPassword) {
                    setError(() => "Provided passwords do not match")
                } else {
                    await createUser(email, password)
                    await updateProfile(auth.currentUser, {
                        displayName: username
                      })
                    navigate('/Home')
                }
            }
        } catch (e) {
            if (e.message == "Firebase: Error (auth/email-already-in-use).") {
                setError(() => "You already have an existing account")
            }            
        }
    }

    return (
        
        <div id='signup-container'>
            <div id="signup-credentials-container">
                <div id="signup-text-desc-container">
                    <h1>Sign up</h1>
                    <p>
                        Already have an account? {' '}
                        <Link to='/login'>Log in</Link>
                    </p>
                    {setError != '' && <p id="signup-error">{error}</p>}
                </div>
                <form id='signup-form' onSubmit={handleSubmit}>
                    <div className='signup-label-container'>
                        <label className='signup-label'>Username</label>
                        <input className='login-input' 
                            onChange={(e) => setUsername(e.target.value)} 
                            type='username' 
                    />
                    </div>
                    <div className='signup-label-container'>
                        <label className='signup-label'>Email</label>
                        <input 
                            className='signup-input' 
                            onChange={(e) => setEmail(e.target.value)} 
                            type='email' 
                        />
                    </div>
                    <div className='signup-label-container'>
                        <label className='signup-label'>Password</label>
                        <input 
                            className='signup-input' 
                            onChange={(e) => setPassword(e.target.value)} 
                            type='password' 
                        />
                    </div>
                    <div className='signup-label-container'>
                        <label className='signup-label'>Confirm password</label>
                        <input 
                            className='signup-input' 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            type='password' 
                        />
                    </div>
                    <div>
                        <button className='signup-button'>Sign up</button>
                        <p><Link to='/'>Home</Link></p>
                    </div>
                </form>
            </div>
            <div id='signup-img-container'>
                <img id='signup-img' src={signupImg} />
            </div>
        </div>
    )
}

export default Signup;

/* <div id='login-container'>
      <div id="credentials-container">
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
            <label class='login-label'>Email </label>
            <input class='login-input' 
                   onChange={(e) => setEmail(e.target.value)} 
                   type='email' 
            />
          </div>
          <div className='login-label-container'>
            <label class='login-label'>Password</label>
            <input class='login-input' onChange={(e) => setPassword(e.target.value)} type='password' />
          </div>
          <div>
          <button class='login-button'>Log In</button>
            <p><Link to='/'>Home</Link></p>
          </div>
        </form>
      </div>
      <div id='login-img-container'>
        <img id='login-img' src={loginImg} />
      </div>
    </div>
    */