import { Link } from 'react-router-dom'
import home from "../img/bg.png";
import React from 'react'

import './LandingPage.css'

function LandingPage() {
    return (
    <div class="landing-page">
        <div className="home-page-container">
            <div className="landing-page-content">
                <h1>studyPal</h1>
                <p>A productivity application to help you plan your busy days!</p>
                <div class='landing-page-button-container'>
                    <p class="landing-page-button"><Link to='/login'>Log in</Link></p>
                    <p class="landing-page-button"><Link to='/signup'>Sign up</Link></p>
                </div>
            </div>
            <div className="landing-page-img-container">
                <img className="landing-page-img" src={home}></img>
            </div>    
        </div>
    </div>
    )
}

export default LandingPage;


