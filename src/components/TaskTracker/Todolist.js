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
    where,
    setDoc,
    doc
} from "firebase/firestore"

const ascending = 'asc'
const descending = 'desc'

    


const Todolist = () => {
    const {user} = UserAuth()
    const [createTask, setCreateTask] = useState(false)
    const [allTasks, setAllTasks] = useState([])
    const [sticky, setSticky] = useState([])
    const [sortTaskRecord, setSortTaskRecord] = useState([])

    const [sortButtonsClicked, setSortButtonsClicked] = useState(false)

    const toggleSortOptions = () => {
        setSortButtonsClicked(() => !sortButtonsClicked)
    }

    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "todos-sort-state"), where("uid", "==", user.uid))
            console.log("Retrieving todos sort state")
            onSnapshot(q, (querySnapshot) => {
                let todoStateRecord = []
                querySnapshot.forEach((doc) => {
                    todoStateRecord.push({...doc.data()})
                })
                setSortTaskRecord(() => todoStateRecord)
                console.log(todoStateRecord)
            })
        return () => {active = false}}
    }, [user.uid])

    /* Retreive all tasks created */ 
    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "todos"), where("uid", "==", user.uid), orderBy("createdAt"))
            console.log("Retrieving task list")
            onSnapshot(q, (querySnapshot) => {
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
            onSnapshot(q, (querySnapshot) => {
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

    const sortCreatedTime = (tasksToSort, order) => {
        let sorted = tasksToSort.sort((task1, task2) => {
            if (order == ascending) {
                return task1['createdAt']['seconds'] == task2['createdAt']['seconds'] ? 0 :
                task1['createdAt']['seconds'] > task2['createdAt']['seconds'] ? -1 : 1
            } else {
                return task1['createdAt']['seconds'] == task2['createdAt']['seconds'] ? 0 :
                task1['createdAt']['seconds'] > task2['createdAt']['seconds'] ? 1 : -1
            }
        })
        return sorted
    }
    
    const sortUrgency = (tasksToSort, order) => {
        tasksToSort.map((task) => {
            if (task['urgency'] == "High") {
                order == ascending ? task['order'] = 3 :task['order'] = 1
            } else if (task['urgency'] == "Medium") {
                task['order'] = 2
            } else {
                order == ascending ? task['order'] = 1 : task['order'] = 3
            }
         })
    
        let sorted = tasksToSort.sort((task1, task2) => {
            return task1['order'] == task2['order'] ? 0 :
            task1['order'] > task2['order'] ? -1 : 1
        })
        return sorted

    }
        
    const sortTasksByUrgency = async (order) => {
        allTasks.map((task) => {
            if (task['urgency'] == "High") {
                order == ascending ? task['order'] = 3 :  task['order'] = 1
            } else if (task['urgency'] == "Medium") {
                task['order'] = 2
            } else {
                order == ascending ? task['order'] = 1 :  task['order'] = 3
            }
         })
        let sorted = allTasks.sort((task1, task2) => {
            return task1['order'] == task2['order'] ? 0 :
            task1['order'] > task2['order'] ? -1 : 1
        })
        setAllTasks(() => sorted)

        let newOrder = {
            uid: user.uid,
            sortCategory: 'urgency',
            sortOrder: order
        }
        await setDoc(doc(db, "todos-sort-state", user.uid), newOrder)
        toggleSortOptions()

    }

    const sortTasksByCreatedTime = async (order) => {
        let sorted = allTasks.sort((task1, task2) => {
            if (order == ascending) {
                return task1['createdAt']['seconds'] == task2['createdAt']['seconds'] ? 0 :
                task1['createdAt']['seconds'] > task2['createdAt']['seconds'] ? -1 : 1
            } else {
                return task1['createdAt']['seconds'] == task2['createdAt']['seconds'] ? 0 :
                task1['createdAt']['seconds'] > task2['createdAt']['seconds'] ? 1 : -1
            }
        })
        setAllTasks(() => sorted)

        let newOrder = {
            uid: user.uid,
            sortCategory: 'created-time',
            sortOrder: order
        }
        await setDoc(doc(db, "todos-sort-state", user.uid), newOrder)
        toggleSortOptions()
    }
    sortTaskRecord.length != 0 ? sortTaskRecord[0]['sortCategory'] == "urgency" ?
    sortUrgency(allTasks, sortTaskRecord[0]['sortOrder']) : sortCreatedTime(allTasks, sortTaskRecord[0]['sortOrder']) :
    sortCreatedTime(allTasks, descending)

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
                <button className="create-task-button" onClick={toggleSortOptions}>Sort options</button>
                <div id="sort-tasks-container">
                    {sortButtonsClicked && <button className="sort-tasks-button" onClick={() => sortTasksByCreatedTime(descending)}>Created Time Descending</button>}
                    {sortButtonsClicked && <button className="sort-tasks-button" onClick={() => sortTasksByCreatedTime(ascending)}>Created Time Ascending</button>}
                    {sortButtonsClicked && <button className="sort-tasks-button" onClick={() => sortTasksByUrgency(descending)}>Urgency Descending</button>}
                    {sortButtonsClicked && <button className="sort-tasks-button" onClick={() => sortTasksByUrgency(ascending)}>Urgency Ascending</button>}
                </div>
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