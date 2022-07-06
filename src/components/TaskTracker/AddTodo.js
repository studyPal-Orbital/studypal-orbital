import React from 'react'
import { useState } from 'react'

import { db } from "../../firebase"
import { collection, 
         addDoc, 
         updateDoc, 
         serverTimestamp } from "firebase/firestore"


import { TextField } from '@mui/material';

import { UserAuth } from '../../context/AuthContext'


const AddTodo = () => {
    const [task, setTask] = useState("")

    const {user}  = UserAuth()

    const handleUserInput = (e) => {
        setTask(() => e.target.value)
    }

    const addNewTask = async (e) => {
        if (task != "") {
            await addDoc(collection(db, "todos"), {
                task,
                completed:false,
                createdAt: serverTimestamp(),
                uid: user.uid
            })
            setTask(() => "")
        }
    }

    return (
        <>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css" crossorigin="anonymous"></link>
        <div className="add-todo-container">
            <div className="input-container">            
                <TextField 
                    id="standard-basic" 
                    label="Add task" 
                    variant="standard" 
                    className="add-todo-input"
                    placeholder={"Add Task"}
                    value={task}
                    onChange={handleUserInput}
                />
            </div>
            <div className="add-todo-button-container">
                <button className="add-todo-button" onClick={addNewTask}>
                <i class="fa-solid fa-plus fa-2x"></i>
                </button>
            </div>
        </div>
        </>
    )
}

export default AddTodo