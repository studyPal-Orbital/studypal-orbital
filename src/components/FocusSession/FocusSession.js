import React from 'react'
import { Component } from "react";
import Countdown from "./Countdown";
import Title from "../Title/Title.js";
import Header from '../Header/Header.js'
import Music from './Music.js'
import Canvas from './Canvas.js'
import './FocusSession.css'


import { useEffect, useRef, useState } from 'react';

import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";


function FocusSession () {
    return (
        <div class="timer">
            <Header />
            <Title name={'Focus Session'} />
            <div className="timer-canvas-container">
                <div className="timer-container">
                    <div className="countdown-container">
                    <div className="text-area-container">
                        <p>Goal Setting</p>
                        <textarea
                            placeholder='Type your goal for this session'
                            className="input-text"
                        />
                    </div>
                        <Countdown 
                            className={"countdown"}
                        />
                    </div>
                </div>
                <div className="canvas-container">
                    <p>Doodling Canvas :) </p>
                    <Canvas />
                </div>
            </div>
            <div className="music-container">
                <p className="music-container-text">Study Music Tracks</p>
                    <Music />
                </div>
        </div>
    )
}

export default FocusSession;


