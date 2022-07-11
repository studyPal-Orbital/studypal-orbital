import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'

import signupImg from "../img/bg.png";
import './LoginSignup.css'

import { getAuth, sendPasswordResetEmail, updateProfile } from "firebase/auth";

const auth = getAuth();

const Signup = () => {
    const [username, setUsername] = useState(' ')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [confirmPassword, setConfirmPassword] = useState("")


    const { createUser } = UserAuth() 
    const navigate = useNavigate()

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
            
            console.log(e.message)
        }
    }


    return (
        <div className='signup-container'>
        <div className="credentials-container">
            <h1>Sign up</h1>
            <p>
            Already have an account? {' '}
            <Link to='/login'>Log in</Link>
            </p>
            {setError != '' && <p className="login-signup-error">{error}</p>}
            <form class='signup-form' onSubmit={handleSubmit}>
            <div className='signup-label-container'>
                <label class='signup-label'>Username</label>
                <input class='login-input' 
                    onChange={(e) => setUsername(e.target.value)} 
                    type='username' 
            />
            </div>
            <div className='signup-label-container'>
                <label class='signup-label'>Email</label>
                <input 
                    class='signup-input' 
                    onChange={(e) => setEmail(e.target.value)} 
                    type='email' 
                />
            </div>
            <div className='signup-label-container'>
                <label class='signup-label'>Password</label>
                <input 
                    class='signup-input' 
                    onChange={(e) => setPassword(e.target.value)} 
                    type='password' 
                />
            </div>
            <div className='signup-label-container'>
                <label class='signup-label'>Confirm password</label>
                <input 
                    class='signup-input' 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    type='password' 
                />
            </div>
            <div>
                <button class='signup-button'>Sign up</button>
                <p><Link to='/'>Home</Link></p>
            </div>
            </form>
        </div>
        <div className='signup-img-container'>
            <img className='signup-img' src={signupImg} />
        </div>
    </div>
    )
}

export default Signup;
