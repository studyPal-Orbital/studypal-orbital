import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'
import Sunset from "../img/mountain.png";
import React from 'react'
import Header from '../Header/Header.js';
import './Home.css'

const Home = () => {

    const { user, logout } = UserAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
         <div className="home-page-container">
            <Header />
            <div className="home-page-img-container">
                <img src={Sunset} className="sunset" alt="Stationary"/>
            </div>
            <div className="home-page-content-container">
                <h1 className="home-page-title">Welcome Back!</h1>
                <p className='home-page-emailacc'>{ user.email }</p>
                <button className = 'home-signout' onClick={handleLogout}>Sign out</button>
            </div>
        </div>
    )
}

export default Home;

