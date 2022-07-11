import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from '../Header/Header.js'
import Title from '../Title/Title.js'
import active from '../img/active.png'
import archive from '../img/archive.png'
import dp from '../img/dp.jpg'

import CalendarHeatmap from "react-calendar-heatmap";

import EditIcon from "@mui/icons-material/Edit"

import {db} from "../../firebase.js"
import { UserAuth } from '../../context/AuthContext'

import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    setDoc,
    deleteDoc,
    where,
    QuerySnapshot,
    addDoc
} from "firebase/firestore"


let classForValue = (value) => {
    let colScale = 1
    if (!value) {
      return 'color-empty';
    } else {
        let count = value.count
        switch (true) {
            case count <= 5:
                colScale = 1
                break
            case count <= 10:
                colScale = 2
                break
            case count <= 15:
                colScale = 3
                break
            case count <= 20:
                colScale = 4
                break
            case count > 20:
                colScale = 5
                break
            default:
                colScale = "empty"
        }
    }
    return `color-scale-${colScale}`
}

const Analytics = () => {

    const {user}  = UserAuth()

    const [tasksCompleted, setTasksCompleted] = useState([])
    const [timeStudied, setTimeStudied] = useState([])
    const [totalTasksCompleted, setTotalTasksCompleted] = useState(0)
    const [totalTimeStudied, setTotalTimeStudied] = useState(0)

    const calculateTotalTasksCompleted = (taskRecords) => {
        let counter = 0
        taskRecords.forEach((task) => {
            counter += task.count
        })
        setTotalTasksCompleted(() => counter)
    }

    const calculateTotalTimeStudied = (sessions) => {
        let counter = 0
        sessions.forEach((task) => {
            counter += task.count
        })
        setTotalTimeStudied(() => counter)
    }

    useEffect(() => {
        let active = true
        if (active == true & user.uid != null) {
            const q = query(collection(db, "todos-record"), where("uid", "==", user.uid))
            console.log("Retrieving user task completion records")
            const getAllTasks = onSnapshot(q, (querySnapshot) => {
                let taskRecords = []
                querySnapshot.forEach((doc) => {
                    let record = {
                        date: doc.data()['date'],
                        count: doc.data()['count']
                    }
                    taskRecords.push(record)
                })
                setTasksCompleted(() => taskRecords)
                calculateTotalTasksCompleted(taskRecords)
            })
            return () => {active = false}}
    }, [user.uid, totalTasksCompleted])

    
    useEffect(() => {
        let active = true
        if (active == true & user.uid != null) {
            const q = query(collection(db, "time-studied-record"), where("uid", "==", user.uid))
            console.log("Retrieving user time studied records")
            const getAllTasks = onSnapshot(q, (querySnapshot) => {
                let timeStudiedRecords = []
                querySnapshot.forEach((doc) => {
                    let record = {
                        date: doc.data()['date'],
                        count: Number((doc.data()['time'] / 3600000).toFixed(3))
                    }
                    timeStudiedRecords.push(record)
                    console.log(timeStudiedRecords)
                })
                setTimeStudied(() => timeStudiedRecords)
                calculateTotalTimeStudied(timeStudiedRecords)
            })
            return () => {active = false}}
    }, [user.uid])
    
    return (
        <div>
            <Header />
            <Title name={"Profile"} />
            <div className="achievements-container">
                <div className="side-col">
                    <h3>Account details</h3>
                    <img className="profile-pic" src={dp}></img>
                    <p>Email: {user.email}</p>
                    <NavLink className='side-col-ext-links' to='/achievements'>
                            View Badges Collected
                    </NavLink>
                    <div className="side-col-links-container">
                        <h3>Mood Journals</h3>
                        <NavLink className='side-col-links' to='/journal'>
                            <EditIcon/>
                        </NavLink>
                    </div>
                    <div className='side-col-books'>
                        <NavLink className='side-col-img-links' to='/archived-thoughts'>
                            <img className='side-col-img' src={archive}></img>
                        </NavLink>
                        <NavLink className='side-col-img-links' to='/active-thoughts'>
                            <img className='side-col-img' src={active}></img>
                        </NavLink>
                    </div>
                    <div className="side-col-links-container">
                        <NavLink className='side-col-ext-links' to='/bubbles'>
                            Pop some bubbles!
                        </NavLink>
                    </div>
                </div>
                <div className="analytics-container">
                    <h3>Your Activity at a glance</h3>
                    <div className='overall-analytics'>
                        <p>{totalTasksCompleted} tasks completed</p>
                        <p>{totalTimeStudied < 1 ? `< 1` : totalTimeStudied.toFixed(2)} hours spent studying</p>
                    </div>
                    <h3>Focus Sessions</h3>
                    <CalendarHeatmap
                            className="activity-calendar"
                            startDate={new Date(`${new Date().getFullYear()-1}-12-31`)}
                            endDate={new Date(`${new Date().getFullYear()}-12-31`)}
                            values={timeStudied}
                            classForValue= {classForValue}
                            tooltipDataAttrs={value => {
                                let count = 0
                                if (value.count != null) {
                                    count = value.count
                                }
                                return {
                                  'data-tip': `${count} hours studied`
                                }
                            }
                        }
                    />
                    <div className="goal-setting-section">
                        <h3 className="achievements-title">Task Completion</h3>
                        <CalendarHeatmap
                            className="activity-calendar"
                            startDate={new Date(`${new Date().getFullYear()-1}-12-31`)}
                            endDate={new Date(`${new Date().getFullYear()}-12-31`)}
                            values={tasksCompleted}
                            classForValue={classForValue}
                            tooltipDataAttrs={value => {
                                let count = 0
                                if (value.count != null) {
                                    count = value.count
                                }
                                return {
                                  'data-tip': `${count} tasks completed`
                                }
                            }
                        }
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Analytics


