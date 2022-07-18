import { Link } from 'react-router-dom'
import home from "../img/study.svg";
import React from 'react'
import './LandingPage.css'

const LandingPage = () => {
    return (
        <div id="landing-page-container">
            <div id="landing-page-content-container">
                <h1 id="landing-page-title">studyPal</h1>
                <p id="landing-page-caption">A productivity application to help you plan your busy days!</p>
                <div id='landing-page-button-container'>
                    <Link className="landing-page-button" id="landing-page-login-button" to='/login' data-cy="log-in">Log in</Link>
                    <Link className="landing-page-button" id="landing-page-signup-button" to='/signup'>Sign up</Link>
                </div>
            </div>
            <div id="landing-page-img-container">
                <img id="landing-page-img" src={home} alt={"landing-page-img"} data-cy={"greeting-img"}></img>
            </div>    
        </div>
    )
}

export default LandingPage;


