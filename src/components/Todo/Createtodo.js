import React from "react"
import { useState } from "react"

import { NavLink } from "react-router-dom"

import { db } from "../../firebase"
import { collection, 
         addDoc, 
         updateDoc, 
         serverTimestamp } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'
import { preventDefault } from "@fullcalendar/react"


const Createtodo = () => {

    const {user} = UserAuth()

    const [inputTaskTitle, setInputTaskTitle] = useState("")
    const [inputTaskBody, setInputTaskBody] = useState("")
    const [inputTaskUrgency, setInputTaskUrgency] = useState("Low")

    const recordUserInputTaskTitle = (e) => {
        setInputTaskTitle(() => e.target.value)
    }

    const recordUserInputTaskBody = (e) => {
        setInputTaskBody(() => e.target.value)
    }

    const recordUserInputTaskUrgency = (e) => {
        setInputTaskUrgency(() => e.target.value)
    }

    const addNewTask = async (e) => {
        if (inputTaskTitle != "") {
            let newTask = {
                title: inputTaskTitle,
                body: inputTaskBody,
                urgency: inputTaskUrgency,
                completed: false,
                createdAt: new Date(),
                uid: user.uid
            }
            await addDoc(collection(db, "todos"), newTask)
            setInputTaskTitle(() => "")
            setInputTaskBody(() => "")
            setInputTaskUrgency(() => "Low")
        }
    }

    return (
        <div>
            <label>Title</label>
            <input 
                value={inputTaskTitle}
                onChange={recordUserInputTaskTitle}
            />
            <label>Description</label>
            <input 
                value={inputTaskBody}
                onChange={recordUserInputTaskBody}
            />
            <select onChange={recordUserInputTaskUrgency}>
                <option value={"Low"}>Low</option>
                <option value={"Medium"}>Medium</option>
                <option value={"High"}>High</option>
            </select>
            <button onClick={addNewTask}>Submit</button>
        </div>
    )
}

export default Createtodo