import React from 'react'
import Countdown from "./Countdown";
import Title from "../Title/Title.js";
import Header from '../Header/Header.js'
import Music from './Music.js'
import './FocusSession.css'

function FocusSession () {
    return (
        <div id="focus-session-container">
            <Header />
            <Title name={'Focus Session'} />
            <div id="timer-music-container">
                <div id="timer-container">
                    <div id="text-area-container">
                        <label id="goal-label">Goal Setting</label>
                        <textarea
                            name="goal"
                            placeholder='Type your goal for this session'
                            id="goal-setting-text-area"
                            data-cy="goal-input"
                        />
                    </div>
                    <div id="countdown-container">
                        <Countdown 
                            className={"countdown"}
                        />
                    </div>
                </div>
                <div id="music-container">
                <p id="music-title-text">Study Music Tracks</p>
                    <Music />
                </div>
            </div>
        </div>
    )
}

export default FocusSession;


