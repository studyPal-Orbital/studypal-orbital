import React, { useEffect, useState } from "react";
import Popup from "./Popup";

const Countdown = () => {

    const [ timerRunning, setTimerRunning ] = useState(false); // Is the timer running?
    const [ startTime, setStartTime ] = useState(0); // Start time (in milliseconds).
    const [ totalTime, setTotalTime ] = useState(0); // Total time (in ms) the timer will run.
    const [ studyTime, setStudyTime ] = useState(0)
    // Pop-up page after countdown has stopped.
    const [countdownEnd, setCountdownEnd] = useState(false);

    // Whenever timerRunning or totalTime changes, useEffect is called.
    useEffect(() => {
        let intervalId;
        if (timerRunning) {
            // If timer is running, start interval.
            intervalId = setInterval(() => {
                const remainingTime = totalTime - 1000;
                if (remainingTime >= 0) {
                    // Update total time accordingly.
                    setTotalTime(remainingTime);
                } else {
                    // Remaining time < 0,
                    // clear the interval, stop timer from running, alert user with a message.
                    clearInterval(intervalId);
                    setTimerRunning(false);
                    setStartTime(0);
                    setTotalTime(0);
                    setCountdownEnd(true);
                    // alert("Congratulations! You have successfully completed your study session!");
                }
            }, 1000);
        }

        // Stop timer.
        return() => {
            clearInterval(intervalId);
        }
    }, [timerRunning, totalTime])

    // Called when timer is started or resumed.
    // Start the timer by setting it to running state, and setting current time as startTime and totalTime.
    const startTimer = () => {
        setTimerRunning(true);
        setStartTime(totalTime);
        setTotalTime(totalTime);
        setStudyTime(totalTime)
    };

    // Called when timer is stopped.
    // Stop the timer by stopping it from running.
    const stopTimer = () => {
        setTimerRunning(false);
    };
    
    // Called when timer is reset.
    const resetTimer = () => {
        if (timerRunning === false) {
            // If timer has stopped running,
            // reset totalTime to startTime.
            setTotalTime(0);
            setStartTime(0);
        }
    };

    // Called to set desired duration (hours, minutes, seconds).
    // 1 s = 1000 ms, 1 min = 60 000 ms, 1 h = 3 600 000 ms, 24 h = 86 400 000 ms.
    // Each button checks if the input time is valid, i.e. lies within the time frame 0ms to 24h. 
    // If valid, update totalTime.
    const setDuration = input => {
        const max = 86400000; // 24 hours.
        if (!timerRunning) {
            if (input === "addHours" && totalTime + 3600000 < max) {
                setTotalTime(totalTime + 3600000);
            } else if (input === "minusHours" && totalTime - 3600000 >= 0) {
                setTotalTime(totalTime - 3600000);
            } else if (input === "addMinutes" && totalTime + 60000 < max) {
                setTotalTime(totalTime + 60000);
            } else if (input === "minusMinutes" && totalTime - 60000 >= 0) {
                setTotalTime(totalTime - 60000);
            } else if (input === "addSeconds" && totalTime + 1000 < max) {
                setTotalTime(totalTime + 1000);
            } else if (input === "minusSeconds" && totalTime - 1000 >= 0) {
                setTotalTime(totalTime - 1000);
            }
        }
    };
    
    // Display time as 2 digits by concatenating a “0” in front (to correct 1 digit),
    // then use slide() to take the last 2 digits (to correct results with more than 2 digits).
    // e.g. totalTime = 5h 18min = 19 080 000 should be displayed as 05:18:00, 
    // i.e. seconds = 00, minutes = 018 = 18, hours = "0" + Math.floor(5.3) = 05.
    let seconds = ("0" + (Math.floor((totalTime / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((totalTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor((totalTime / 3600000) % 60)).slice(-2);

    return (
        <>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css" crossorigin="anonymous"></link>
        <div id="countdown-card">
                {/* Upwards White Arrow &#8679 */}
                <div id="countdown-buttons-first-row">
                    <button class = 'countdown-setTime' data-cy="set-hours-increase" onClick={() => setDuration("addHours")}>&#8679;</button>
                    <button class = 'countdown-setTime' data-cy="set-minutes-increase" onClick={() => setDuration("addMinutes")}>&#8679;</button>
                    <button class = 'countdown-setTime' data-cy="set-seconds-increase" onClick={() => setDuration("addSeconds")}>&#8679;</button>
                </div>

                <div className="countdown-timeDisplay" data-cy="time-left">
                    {hours} : {minutes}  : {seconds}
                </div>
            
                {/* Downwards White Arrow &#8681 */}
                <div id="countdown-buttons-second-row">
                    <button class = 'countdown-setTime' onClick={() => setDuration("minusHours")}>&#8681;</button>
                    <button class = 'countdown-setTime' onClick={() => setDuration("minusMinutes")}>&#8681;</button>
                    <button class = 'countdown-setTime' data-cy="set-seconds-decrease" onClick={() => setDuration("minusSeconds")}>&#8681;</button>
                </div>
            </div>
            <div class="button-wrapper">
                {/* Start - Show button when timer is not running and 
                (start time is 0, or equals total time, or total time is 0). */}
                {timerRunning === false && (startTime === 0 || startTime === totalTime || totalTime === 0) && (
                    <button className="countdown-start" data-cy="start-timer" onClick={startTimer}>
                        Start
                    </button>
                )}
        
                {/* Stop - Show button when timer is running and time >= 1 second. */}
                {timerRunning === true && totalTime >= 1000 && (
                    <button className="countdown-stop" data-cy="stop-timer" onClick={stopTimer}>
                        Stop
                    </button>
                )}
            
                {/* Resume - Show button when timer is not running and 
                (start time > 0, and not equals total time, and total time not equals 0). */}
                {timerRunning === false && (startTime > 0 && startTime !== totalTime && totalTime !== 0) && (
                    <button className="countdown-start" data-cy="resume-timer" onClick={startTimer}>
                        Resume
                    </button>
                )}
        
                {/* Reset - Show button when timer is not running and 
                (start time > 0, or not equals total time, or total time > 0. */}
                {timerRunning === false && (startTime > 0 || startTime !== totalTime || totalTime > 0) && (
                    <button className="countdown-reset" data-cy="reset-timer" onClick={resetTimer}>
                        Reset
                    </button>
                )}
        </div>
        <Popup timeStudied={studyTime} trigger={countdownEnd} setTrigger={setCountdownEnd}>
            <h1 id="timer-done-title" data-cy="session-finished">Congratulations!<i className="fa-solid fa-trophy fa-bounce fa-2x"></i></h1>
            <h2 id="timer-done-text" data-cy="session-finished">You have successfully completed your study session!</h2>
        </Popup>
        </>
    );
    
}

export default Countdown;
