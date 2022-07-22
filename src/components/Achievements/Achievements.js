import React from "react";
import { NavLink } from "react-router-dom";
import Title from "../Title/Title.js";
import "./Achievements.css";

import TotalStudyTime from "./TotalStudyTime.js";
import FirstStudySession from "./Icons/FirstStudySession.js";
import FiftyHours from './Icons/FiftyHours.js';

const Achievements = () => {
    return (
    <>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css" crossorigin="anonymous"></link>
    <div className="achievements">
        <Title name={"Achievements"} />
        <NavLink to="/analytics">Back</NavLink>
        <TotalStudyTime />
        <div className="cards">

            <div className="card">
                <div className="container">
                    <FirstStudySession />
                </div>
            </div>

            <div className="card">
                <div className="container">
                    <FiftyHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>100 hours</h4>
                    <i class="fa-solid fa-star-half-stroke fa-2x half-stroke-star"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>200 hours</h4>
                    <i class="fa-solid fa-star fa-2x two-star"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>300 hours</h4>
                    <i class="fa-solid fa-star fa-2x three-star"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>400 hours</h4>
                    <i class="fa-solid fa-award fa-2x four-badge"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>500 hours</h4>
                    <i class="fa-solid fa-award fa-2x five-badge"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>600 hours</h4>
                    <i class="fa-solid fa-award fa-2x six-badge"></i>
                    <p>Accomplished</p>
                </div>
            </div>

            <div className="card">
                <div className="container">
                    <h4>700 hours</h4>
                    <i class="fa-solid fa-award fa-2x seven-badge"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>800 hours</h4>
                    <i class="fa-solid fa-medal fa-2x eight-medal"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>900 hours</h4>
                    <i class="fa-solid fa-medal fa-2x nine-medal"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>1000 hours</h4>
                    <i class="fa-solid fa-medal fa-2x ten-medal"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>2000 hours</h4>
                    <i class="fa-solid fa-trophy fa-2x twenty-trophy"></i>
                    <p>Accomplished</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>3000 hours</h4>
                    <i class="fa-solid fa-trophy fa-2x thirty-trophy"></i>
                    <p><i class="fa-solid fa-lock"></i> Locked</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>4000 hours</h4>
                    <i class="fa-solid fa-trophy fa-2x forty-trophy"></i>
                    <p><i class="fa-solid fa-lock"></i> Locked</p>
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <h4>5000 hours</h4>
                    <i class="fa-solid fa-crown fa-2x fifty-crown"></i>
                    <p><i class="fa-solid fa-lock"></i> Locked</p>
                </div>
            </div>

        </div>
    </div>
    </>
    );

};

export default Achievements;