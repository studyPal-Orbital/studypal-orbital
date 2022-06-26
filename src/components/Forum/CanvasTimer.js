import React from "react"; 

import { useState, useEffect } from "react";

const CanvasTimer = (props) => {
    let [timerClock, setTimerClock] = useState(5000); 
    useEffect(() => {
        if (props.startTime == true) {
            const timer = setTimeout(() => {
                console.log("minus: ", timerClock)
                setTimerClock(() => timerClock - 1);
            }, 1000)
            return () => { 
            clearTimeout(timer)
            }
        }}, [timerClock])
    return (
        <div>
            <p>{timerClock}</p>
        </div>
    )
}


export default CanvasTimer


/*

 let [startTimer, setStartTimer] = useState(false)
    let [timerClock, setTimerClock] = useState(0); 
    useEffect(() => {
        if (startTimer == true) {
            const timer = setTimeout(() => {
                console.log("minus: ", timerClock)
                setTimerClock(() => timerClock - 1);
            }, 1000)

            return () => { 
            clearTimeout(timer)
            }
        }}, [timerClock, startTimer])

        */