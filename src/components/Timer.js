import React, { Component } from "react";
import Countdown from "./Countdown";

function Timer () {
    return (
        <div class="timer">
            <h1 class="title">Timer</h1>
            <div className="timer-countdown">
                <Countdown />
            </div>
        </div>
    )
}

export default Timer;