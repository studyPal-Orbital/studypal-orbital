import React from "react"
import Header from '../Header/Header.js'
import Title from '../Title/Title.js'
import './Todo.css'
import Createtodo from "./Createtodo.js"
import Todoitem from "./Todoitem.js"
import Sticky from "./Sticky.js"

import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"

import { UserAuth } from '../../context/AuthContext'

import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot,
    serverTimestamp,
    orderBy, 
    where
} from "firebase/firestore"

import ReactMarkdown from 'react-markdown'
import HelpIcon from '@mui/icons-material/Help';

const Todolist = () => {

    const {user} = UserAuth()

    const [userEditing, setUserEditing] = useState(true)
    const [createTask, setCreateTask] = useState(false)
    const [allTasks, setAllTasks] = useState([])
    const [sticky, setSticky] = useState([])

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

    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "sticky"), where("uid", "==", user.uid))
            console.log("Retrieving sticky")
            const getSticky = onSnapshot(q, (querySnapshot) => {
                let currentSticky = []
                querySnapshot.forEach((doc) => {
                    currentSticky.push({...doc.data()})
                })
                setSticky(() => currentSticky)
                console.log(currentSticky)
            })
            return () => {active = false}}
    }, [user.uid])

    const recordUserCreateTaskSelection = () => {
        setCreateTask(() => !createTask)
    }
 
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
                <NavLink to='/about-todo' className="inquiry-button">
                    More Info
                </NavLink>
                <div className="todo-items-container">
                    {createTask && <Createtodo closeCreateTodoScreen={recordUserCreateTaskSelection}/>}
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
                    <div className="sticky-note-container">
                        {sticky.length != 0 && <Sticky text={sticky[0]['content']}/>}
                    </div>                     
                </div>                
            </div>
        </div>
    )

}

export default Todolist