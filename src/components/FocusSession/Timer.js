import React from 'react'
import { Component } from "react";
import Countdown from "./Countdown";
import Title from "../Title/Title.js";
import Header from '../Header/Header.js'
import Music from './Music.js'
import './FocusSession.css'

function Timer () {
    return (
        <div class="timer">
            <Header />
            <Title name={'Focus Session'} />
            <div className="timer-music-container">
                <div className="timer-container">
                    <div className="text-area-container">
                        <textarea
                            placeholder='Type your goal for this session'
                            className="input-text"
                        />
                    </div>
                    <div className="countdown-container">
                        <Countdown 
                            className={"countdown"}
                        />
                    </div>
                </div>
                <div className="music-container">
                   <Music />
                </div>
            </div>
        </div>
    )
}

export default Timer;


