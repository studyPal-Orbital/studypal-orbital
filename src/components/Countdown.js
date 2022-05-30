import React, { Component } from "react";
import "../App.css";

class Countdown extends Component {
    state = {
        timerRunning: false, // Is the timer running?
        startTime: 0, // Start time (in milliseconds).
        totalTime: 0 // Total time (in ms) the timer has been running since start/reset.
    };

    // Called when timer is started or resumed.
    // Start the timer by setting it to running state, and setting current time as startTime and totalTime.
    startTimer = () => {
        this.setState({
          timerRunning: true,
          startTime: this.state.totalTime,
          totalTime: this.state.totalTime
        });

        this.timer = setInterval(() => {
            const remainingTime = this.state.totalTime - 1000;
            if (remainingTime >= 0) {
                // Update total time accordingly.
                this.setState({
                    totalTime: remainingTime
                });
            } else {
                // Remaining time < 0,
                // clear the interval, stop timer from running, alert user with a message.
                clearInterval(this.timer);
                this.setState({ timerRunning: false });
                alert("Congratulations! You have successfully completed your study session!");
            }
        }, 1000);
    };

    // Called when timer is stopped.
    // Stop the timer by clearing the interval and stopping the timer from running.
    stopTimer = () => {
        clearInterval(this.timer);
        this.setState({ timerRunning: false });
    };
    
    // Called when timer is reset.
    resetTimer = () => {
        if (this.state.timerRunning === false) {
            // If timer has stopped running,
            // reset totalTime to startTime.
            this.setState({
                totalTime: this.state.startTime
            });
        }
    };

    // Called to set desired duration (hours, minutes, seconds).
    // 1 s = 1000 ms, 1 min = 60 000 ms, 1 h = 3 600 000 ms, 24 h = 86 400 000 ms.
    // Each button checks if the input time is valid, i.e. lies within the time frame 0ms to 24h. 
    // If valid, update totalTime.
    setDuration = input => {
        const { totalTime, timerRunning } = this.state;
        const max = 216000000; // 60 hours.
        if (!timerRunning) {
            if (input === "addHours" && totalTime + 3600000 < max) {
                this.setState({ totalTime: totalTime + 3600000 });
            } else if (input === "minusHours" && totalTime - 3600000 >= 0) {
                this.setState({ totalTime: totalTime - 3600000 });
            } else if (input === "addMinutes" && totalTime + 60000 < max) {
                this.setState({ totalTime: totalTime + 60000 });
            } else if (input === "minusMinutes" && totalTime - 60000 >= 0) {
                this.setState({ totalTime: totalTime - 60000 });
            } else if (input === "addSeconds" && totalTime + 1000 < max) {
                this.setState({ totalTime: totalTime + 1000 });
            } else if (input === "minusSeconds" && totalTime - 1000 >= 0) {
                this.setState({ totalTime: totalTime - 1000 });
            }
        }
    };
      
    render() {
        const { totalTime, startTime, timerRunning } = this.state;
        // Display time as 2 digits by concatenating a “0” in front (to correct 1 digit),
        // then use slide() to take the last 2 digits (to correct results with more than 2 digits).
        // e.g. totalTime = 5h 18min = 19 080 000 should be displayed as 05:18:00, 
        // i.e. seconds = 00, minutes = 018 = 18, hours = "0" + Math.floor(5.3) = 05.
        let seconds = ("0" + (Math.floor((totalTime / 1000) % 60) % 60)).slice(-2);
        let minutes = ("0" + Math.floor((totalTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor((totalTime / 3600000) % 60)).slice(-2);

        return (
            <div className="countdown">
                <div className="countdown-title">Countdown</div>
                <div className="countdown-labels">Hours : Minutes : Seconds</div>
                <div className="countdown-buttons">
                    {/* Upwards White Arrow &#8679 */}
                    <button class = 'countdown-setTime' onClick={() => this.setDuration("addHours")}>&#8679;</button>
                    <button class = 'countdown-setTime' onClick={() => this.setDuration("addMinutes")}>&#8679;</button>
                    <button class = 'countdown-setTime' onClick={() => this.setDuration("addSeconds")}>&#8679;</button>
                
                    <div className="countdown-timeDisplay">
                        {hours} : {minutes} : {seconds}
                    </div>
                
                    {/* Downwards White Arrow &#8681 */}
                    <button class = 'countdown-setTime' onClick={() => this.setDuration("minusHours")}>&#8681;</button>
                    <button class = 'countdown-setTime' onClick={() => this.setDuration("minusMinutes")}>&#8681;</button>
                    <button class = 'countdown-setTime' onClick={() => this.setDuration("decSeconds")}>&#8681;</button>
                </div>
            
                <div class="button-wrapper">
                    {/* Start - Show button when timer stops running and (start time is 0 or equals total time). */}
                    {timerRunning === false && (startTime === 0 || totalTime === startTime) && (
                        <button className="countdown-start" onClick={this.startTimer}>
                            Start
                        </button>
                    )}
            
                    {/* Stop - Show button when timer is running and time >= 1 second. */}
                    {timerRunning === true && totalTime >= 1000 && (
                        <button className="countdown-stop" onClick={this.stopTimer}>
                            Stop
                        </button>
                    )}
                
                    {/* Resume - Show button when timer is not running and 
                    (start time is not 0, and not equals total time, and total time not equals 0). */}
                    {timerRunning === false && (startTime > 0 && startTime !== totalTime && totalTime !== 0) && (
                        <button className="countdown-start" onClick={this.startTimer}>
                            Resume
                        </button>
                    )}
            
                    {/* Reset - Show button when (timer is not running or total time < 1 second)
                    and (start time not equals total time. */}
                    {(timerRunning === false || totalTime < 1000) && (startTime > 0 && startTime !== totalTime) && (
                        <button className="countdown-reset" onClick={this.resetTimer}>
                            Reset
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default Countdown;
