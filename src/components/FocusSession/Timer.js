import React from 'react'
import { Component } from "react";
import Countdown from "./Countdown";
import Title from "../Title/Title.js";
import Header from '../Header/Header.js'

import music from "../music/lofi_1.mp3";
import rain from "../music/rain.mp3";
import lowfi from "../gif/night.gif";

import './FocusSession.css'

import { TextField } from '@mui/material';


function Timer () {
    return (
        <div class="timer">
            <Header />
            <Title name={'Focus Session'} />
            <div className="timer-music-container">
                <div className="timer-container">
                    <div className="timer-input-container">
                        <TextField 
                            id="standard-basic" 
                            label="Hours" 
                            variant="standard" 
                            className="add-time-input"
                            placeholder={"Hours"}
                        />
                        <TextField 
                            id="standard-basic" 
                            label="Mins" 
                            variant="standard" 
                            className="add-time-input"
                            placeholder={"Mins"}
                        />
                        <TextField 
                            id="standard-basic" 
                            label="Secs" 
                            variant="standard" 
                            className="add-time-input"
                            placeholder={"Mins"}
                        />
                        <button className="start-timer-button">
                            Start
                        </button>  
                    </div> 
                    <Countdown 
                        className={"countdown"}
                    />
                </div>
                <div className="music-container">
                    <img 
                        className={'music-bg'}
                        src={lowfi}
                    />
                    <figure>
                        <audio
                            controls
                            src={music}
                            className={"audio-bar"}
                        />
                    </figure>
                </div>
            </div>
        </div>
    )
}

export default Timer;


