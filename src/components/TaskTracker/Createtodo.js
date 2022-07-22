import React from "react"
import { useState } from "react"
import { db } from "../../firebase"
import { collection, 
         addDoc
        } from "firebase/firestore"
import { UserAuth } from '../../context/AuthContext'

const Createtodo = ({closeCreateTodoScreen}) => {

    const {user} = UserAuth()

    const [inputTaskTitle, setInputTaskTitle] = useState("")
    const [inputTaskBody, setInputTaskBody] = useState("")
    const [inputTaskUrgency, setInputTaskUrgency] = useState("Low")

    /* Record user todo input for title field */
    const recordUserInputTaskTitle = (e) => {
        setInputTaskTitle(() => e.target.value)
    }
    
    /* Record user todo input for description body field */
    const recordUserInputTaskBody = (e) => {
        setInputTaskBody(() => e.target.value)
    }

    /* Record user todo input for urgency field */
    const recordUserInputTaskUrgency = (e) => {
        setInputTaskUrgency(() => e.target.value)
    }

    /* Add user created todo to firebase */ 
    const addNewTask = async (e) => {
        e.preventDefault()
        if (inputTaskTitle !== "") {
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
            closeCreateTodoScreen()
        }
    }

    return (
        <form id="create-task-container">
            <div className="input-container">
                <label className="input-label">Title</label>
                <textarea 
                    name="title-label"
                    id="title-input"
                    value={inputTaskTitle}
                    onChange={recordUserInputTaskTitle}
                    data-cy="title"
                />
            </div>
            <div className="input-container">
                <label className="input-label">Description</label>
                <textarea 
                    name="desc-label"
                    id="desc-input"
                    value={inputTaskBody}
                    onChange={recordUserInputTaskBody}
                    data-cy="desc"
                />
            </div>
            <div className="input-container">
                <label className="input-label">Urgency</label>
                <select name="urgency-label" id="urgency-input" data-cy="urgency" onChange={recordUserInputTaskUrgency}>
                    <option value={"Low"}>Low</option>
                    <option value={"Medium"}>Medium</option>
                    <option value={"High"}>High</option>
                </select>
            </div>
            <button id="submit-task-button" data-cy="submit" onClick={addNewTask}>Submit</button>
        </form>
    )
}

export default Createtodo