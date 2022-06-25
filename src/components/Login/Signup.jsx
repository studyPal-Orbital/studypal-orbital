import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'

import signupImg from "../img/bg.png";
import './LoginSignup.css'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { createUser } = UserAuth() 
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await createUser(email, password)
            navigate('/Home')
        } catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    }

    return (
        <div className='signup'>
            <div className='signup-container'>
                <img className='signup-img' src={signupImg} />
                <h1>Sign up</h1>
                <p>Already have an account? {' '}
                   <Link to='/login'>Log in</Link>
                </p>
            </div>
            <div>
                <form className='signup' onSubmit={handleSubmit}>
                    <div className='signup-label-container'>
                        <label className='signup-label'>Email</label>
                        <input className='signup-input' 
                            onChange={(event) => {
                                setEmail(event.target.value)
                            }}
                            type='email'
                        />
                    </div>
                    <div className='signup-label-container'>
                        <label class='signup-label'>Password</label>
                        <input class='signup-input'
                            onChange={(event) => {
                                setPassword(event.target.value)
                            }}
                            type='password'
                        />
                    </div>
                    <div>
                        {/* Reuse login button */}
                        <button class='login-button'>Sign Up</button>
                        <p><Link to='/'>Home</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;
