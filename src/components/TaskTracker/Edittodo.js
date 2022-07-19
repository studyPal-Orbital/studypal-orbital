import { updateDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase.js"
import { doc } from "firebase/firestore"

const Edittodo = () => {
    const location = useLocation()
    const navigate = useNavigate();

    const { title, body, urgency, id} = location.state

    const [ currentTitle, setCurrentTitle ] = useState(title)
    const [ currentBody, setCurrentBody ] = useState(body)
    const [ currentUrgency, setCurrentUrgency ] = useState(urgency)

    /* Retrieve current title of todo */
    const recordNewTitle = (e) => {
        setCurrentTitle(() => e.target.value)
    }

    /* Retrieve current body desc  of todo */
    const recordNewBody = (e) => {
        setCurrentBody(() => e.target.value)
    }

    /* Retrieve current urgency status of todo */
    const recordNewUrgency = (e) => {
        setCurrentUrgency(() => e.target.value)
    }

    /* Update todo fields in firebase */
    const recordUpdate = async (e) => {
        e.preventDefault()
        let newTask = {
            title: currentTitle,
            body: currentBody,
            urgency: currentUrgency
        }
        console.log(newTask)
        await updateDoc(doc(db, "todos", id), newTask)
        navigate('/task-tracker')
    }

    return (
        <form id="edit-todo-container">
            <div id="edit-todo-nav-container">
                <NavLink id="edit-todo-navlink" to='/task-tracker'>Back</NavLink>
            </div>
            <div id="edit-todo-input-container">
                <label name="edit-title" className="edit-todo-label">Title</label>
                <textarea
                    name="edit-title"
                    className="edit-todo-input"
                    id="edit-todo-input"
                    value={currentTitle}
                    onChange={recordNewTitle}
                    data-cy="edit-title"
                />
                <label name="edit-desc" className="edit-todo-label">Description</label>
                <textarea
                    name="edit-desc"
                    className="edit-todo-input"
                    id="edit-todo-desc"
                    value={currentBody}
                    onChange={recordNewBody}
                    data-cy="edit-body"
                />
                <label name="edit-urgency" className="edit-todo-label">Urgency</label>
                <select 
                    name="edit-urgency" 
                    className="edit-todo-input" 
                    id="edit-todo-urgency" 
                    value={currentUrgency} 
                    onChange={recordNewUrgency}
                    data-cy="edit-urgency"
                >
                    <option value={"Low"}>Low</option>
                    <option value={"Medium"}>Medium</option>
                    <option value={"High"}>High</option>
                </select>
                <div>
                    <button id="edit-todo-button" onClick={recordUpdate} data-cy="update">Update</button>
                </div>
            </div>
        </form>
    )
}

export default Edittodo