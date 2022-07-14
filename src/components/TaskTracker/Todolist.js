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
    orderBy, 
    where
} from "firebase/firestore"

const Todolist = () => {

    const {user} = UserAuth()
    const [createTask, setCreateTask] = useState(false)
    const [allTasks, setAllTasks] = useState([])
    const [sticky, setSticky] = useState([])

    /* Retreive all tasks created */ 
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

    /* Retrieving words typed on sticky */
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
                if (currentSticky.length != 0) {
                    setSticky(() => currentSticky[0]['content'])
                    console.log(currentSticky[0]['content'])
                }
            })
            return () => {active = false}}
    }, [user.uid])

    /* Determine whether user is currently creating a new task (after clicking on create task button) */
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
                <NavLink to='/about-todo' id="inquiry-button">
                    More Info
                </NavLink>
                <div id="todo-items-container">
                    {createTask && <Createtodo closeCreateTodoScreen={recordUserCreateTaskSelection}/>}
                    <div id={"todo-table"}>
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
                    <div id="sticky-note-container">
                        {sticky.length != 0 && <Sticky text={sticky}/>}
                        {sticky.length == 0 && <Sticky text={""}/>}
                    </div>                     
                </div>                
            </div>
        </div>
    )

}

export default Todolist