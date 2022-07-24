import { React, useState, useEffect } from 'react'
import Countdown from "./Countdown";
import Title from "../Title/Title.js";
import Header from '../Header/Header.js'
import Music from './Music.js'
import GoalSetting from "./GoalSetting.js"
import './FocusSession.css'
import { UserAuth } from '../../context/AuthContext'
import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    where,
} from "firebase/firestore"

function FocusSession () {
    const {user}  = UserAuth();
    const [goal, setGoal] = useState([]);

    /* Retrieving words typed on goal setting sticky */
    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "goal"), where("uid", "==", user.uid))
            console.log("Retrieving goal")
            onSnapshot(q, (querySnapshot) => {
                let currentSticky = []
                querySnapshot.forEach((doc) => {
                    currentSticky.push({...doc.data()})
                })
                if (currentSticky.length != 0) {
                    setGoal(() => currentSticky[0]['content'])
                    console.log(currentSticky[0]['content'])
                }
            })
            return () => {active = false}}
    }, [user.uid])

    return (
        <div id="focus-session-container">
            <Header />
            <Title name={'Focus Session'} />
            <div id="timer-music-container">
                <div id="timer-container">
                    <div id="text-area-container">
                        <label id="goal-label">Goal Setting</label>
                        {goal.length != 0 && <GoalSetting text={goal}/>}
                        {goal.length == 0 && <GoalSetting text={""}/>}
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


