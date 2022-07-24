import React from "react";
import { NavLink } from "react-router-dom";
import Title from "../Title/Title.js";
import "./Achievements.css";

import TotalStudyTime from "./TotalStudyTime.js";
import FirstStudySession from "./Icons/FirstStudySession.js";
import FiftyHours from './Icons/FiftyHours.js';
import OneHundredHours from "./Icons/OneHundredHours.js";
import TwoHundredHours from "./Icons/TwoHundredHours.js";
import ThreeHundredHours from "./Icons/ThreeHundredHours.js";
import FourHundredHours from "./Icons/FourHundredHours.js";
import FiveHundredHours from "./Icons/FiveHundredHours.js";
import SixHundredHours from "./Icons/SixHundredHours.js";
import SevenHundredHours from "./Icons/SevenHundredHours.js";
import EightHundredHours from "./Icons/EightHundredHours.js";
import NineHundredHours from "./Icons/NineHundredHours.js";
import OneThousandHours from "./Icons/OneThousandHours.js";
import TwoThousandHours from "./Icons/TwoThousandHours.js";
import ThreeThousandHours from "./Icons/ThreeThousandHours.js";
import FourThousandHours from "./Icons/FourThousandHours.js";
import FiveThousandHours from "./Icons/FiveThousandHours.js";

const Achievements = () => {
    return (
    <>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css" crossorigin="anonymous"></link>
    <div className="achievements">
        <div className="achievements-title">
            <Title name={"Achievements"} />
        </div>

        <div className="achievements-back-button">
            <NavLink id="nav-link-achievements" to="/analytics">Back</NavLink>
        </div>

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
                    <OneHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <TwoHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <ThreeHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <FourHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <FiveHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <SixHundredHours />
                </div>
            </div>

            <div className="card">
                <div className="container">
                    <SevenHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <EightHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <NineHundredHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <OneThousandHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <TwoThousandHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <ThreeThousandHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <FourThousandHours />
                </div>
            </div>
            
            <div className="card">
                <div className="container">
                    <FiveThousandHours />
                </div>
            </div>

        </div>
    </div>
    </>
    );

};

export default Achievements;