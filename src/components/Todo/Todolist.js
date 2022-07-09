import React from "react"
import Header from '../Header/Header.js'
import Title from '../Title/Title.js'
import './Todo.css'
import Createtodo from "./Createtodo.js"
import Todoitem from "./Todoitem.js"

import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"

import { UserAuth } from '../../context/AuthContext'

import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot,
    orderBy, 
    where
  } from "firebase/firestore"

const Todolist = () => {

    const {user} = UserAuth()

    const [createTask, setCreateTask] = useState(false)
    const [allTasks, setAllTasks] = useState([])

    const recordUserCreateTaskSelection = () => {
        setCreateTask(() => !createTask)
    }

    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "todos"), where("uid", "==", user.uid), orderBy("createdAt"))
            console.log("Retrieving task list")
            const getAllTasks = onSnapshot(q, (querySnapshot) => {
                let tasks = []
                querySnapshot.forEach((doc) => {
                    tasks.push({...doc.data(), id:doc.id})
                })
                setAllTasks(() => tasks)
                console.log(tasks)
            })
            return () => {active = false}}
    }, [user.uid])
 
    return (
        <div className="task-tracker-page">
            <Header />
            <Title name={"Todo List"} />
            <NavLink className="task-tracker-nav-link" to='/calendar'>Calendar</NavLink>
            <div className="task-tracker-container">
                {createTask == false ? 
                    <button className="create-task-button" onClick={recordUserCreateTaskSelection}>Create Task</button> :
                    <button className="create-task-button" onClick={recordUserCreateTaskSelection}>Close</button>
                }
                <div className="todo-items-container">
                    {createTask && <Createtodo/>}
                    <div className={"todo-table"}>
                        {allTasks.map((task) => (
                            <Todoitem
                                title={task.title}
                                body={task.body}
                                urgency={task.urgency}
                                completed={task.completed}
                                createdAt={task.createdAt.seconds}
                                id={task.id}
                            />
                        ))}
                    </div>
                    <textarea 
                        className="sticky-note-container"
                        placeholder="Type down your tasks here :)"
                    />                        
                </div>                
            </div>
        </div>
    )

}

export default Todolist