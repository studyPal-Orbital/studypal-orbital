import { updateDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useHistory, useNavigate } from "react-router-dom";

import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    where,
    QuerySnapshot,
    addDoc
  } from "firebase/firestore"

const Edittodo = () => {
    const location = useLocation()
    const navigate = useNavigate();

    const { title, body, urgency, createdAt, id} = location.state

    const [ currentTitle, setCurrentTitle ] = useState(title)
    const [ currentBody, setCurrentBody ] = useState(body)
    const [ currentUrgency, setCurrentUrgency ] = useState(urgency)

    const recordNewTitle = (e) => {
        setCurrentTitle(() => e.target.value)
    }

    const recordNewBody = (e) => {
        setCurrentBody(() => e.target.value)
    }

    const recordNewUrgency = (e) => {
        setCurrentUrgency(() => e.target.value)
    }

    const recordUpdate = async (e) => {
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
        <div className="edit-todo-container">
            <NavLink className="edit-todo-navlink" to='/task-tracker'>Back</NavLink>
            <div className="edit-todo-input-container">
                <label className="edit-todo-label">Title</label>
                <textarea
                    className="edit-todo-title"
                    value={currentTitle}
                    onChange={recordNewTitle}
                />
                <label className="edit-todo-label">Description</label>
                <textarea
                    className="edit-todo-desc"
                    value={currentBody}
                    onChange={recordNewBody}
                />
                <label className="edit-todo-label">Urgency</label>
                <select className="edit-todo-urgency" value={currentUrgency} onChange={recordNewUrgency}>
                    <option value={"Low"}>Low</option>
                    <option value={"Medium"}>Medium</option>
                    <option value={"High"}>High</option>
                </select>
                <button className="edit-todo-button" onClick={recordUpdate}>Update</button>
            </div>
        </div>
    )
}

export default Edittodo