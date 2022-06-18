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
            <div className="container">
                <img src={Sunset} className="sunset" alt="Stationary"/>
            </div>
            <h1>Welcome Back!</h1>
            <p class='home-emailacc'>{ user.email }</p>
            <button class = 'home-signout' onClick={handleLogout}>Sign out</button>
        </div>
    )
}

export default Home;

