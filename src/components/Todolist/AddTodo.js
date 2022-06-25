import { useState } from 'react'

import { db } from "../../firebase"
import { collection, 
         addDoc, 
         updateDoc, 
         serverTimestamp } from "firebase/firestore"

import React from 'react'

const AddTodo = () => {
    const [task, setTask] = useState("")

    const handleUserInput = (e) => {
        setTask(() => e.target.value)
    }

    const addNewTask = async (e) => {
        if (task != "") {
            await addDoc(collection(db, "todos"), {
                task,
                completed:false,
                createdAt: serverTimestamp()
            })
            setTask(() => "")
        }
    }

    return (
        <div className="add-todo-container">
            <input
                className="add-todo-input"
                placeholder={"Add Task"}
                value={task}
                onChange={handleUserInput}
            />
            <button className="add-todo-button" onClick={addNewTask}>
                Add
            </button>
        </div>
    )
}

export default AddTodo
