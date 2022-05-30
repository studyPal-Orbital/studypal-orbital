/*
// Temporary placeholder.
import timer from "./img/timer.jpg";

function Timer () {
    return (
        <div class='timer'>
            <h1 class="title">Timer</h1>
            <div className='timer-img-container'>
                <img src={timer} className="timer-image"/>
            </div>
        </div> 
    )
}

export default Timer;
*/

import React, { Component } from "react";
import Countdown from "./Countdown";

// class Timer extends Component {
//     render() {
//         return (
//             <div className="Timer">
//                 <div className="Timer-title">Timer</div>
//                 <div className="Timers">
//                     <Countdown />
//                 </div>
//             </div>
//         );
//     }
// }

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