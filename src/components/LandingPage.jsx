import React from 'react';
import { Link } from 'react-router-dom';
import homepageBackground from "./img/homepage-bg.jpg";

function LandingPage() {
    return (
    <div class="landing-page">
        { /* Reuses same font style from Home*/ }
        <div className="home-page-container">
            <h1>studyPal</h1>
            <p>A productivity application to help you plan your busy days!</p>
            <div class='landing-page-button-container'>
                <p class="landing-page-button"><Link to='/login'>Log in</Link></p>
                <p class="landing-page-button"><Link to='/signup'>Sign up</Link></p>
            </div>
            <img src={homepageBackground}></img>
        </div>
    </div>
    )
}

export default LandingPage;


