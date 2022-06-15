import { useState, useEffect } from "react"
import { db } from "../../firebase"
import { async } from "@firebase/util"

import { doc, setDoc, addDoc, collection } from "firebase/firestore"; 


const Addtodo = () => {

    const [task, setNewTask] = useState("")

    const handleUserInput = (e) => {
        setNewTask(() => e.target.value)
    }

    const createNewTask = async (e) => {
        e.preventDefault()
        if (task != "") {
            let newTask = {
                task,
                completed : false
            }
            await(addDoc(collection(db, "todos"), newTask))
            setNewTask(() => "")
        }
    }
    
    return (
        <div className="add-todo-container">
            <form className="add-todo-form" onSubmit={createNewTask}>
                <div className="add-todo-input-container">
                    <input 
                        className="add-todo-input"
                        placeholder="Add a new task"
                        onChange={handleUserInput}
                        value={task}
                    />
                </div>
                <div className="add-todo-button-container">
                    <button className="add-todo-button">
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

//await addDoc(collection(db, "todos"), newTask)

export default Addtodo
/*
const Addtodo = () => {

    const [task, setTask] = useState("")

    /* Set task to user typed input 
    const handleUserInput = (e) => {
        setTask(() => e.target.value)
    }

    /* Add new task to db 
    const createNewTask = async(e) => {
        e.preventDefault()
        if (task != "") {
            let newTask = {
                task,
                completed : false
            }
            await addDoc(collection(db, "todos"), newTask)
            setTask("")
        }
    }

    return (
        <div className="Addtodo-container">
            <form onSubmit={createNewTask}>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Add task"
                        value={task}
                        onChange={handleUserInput}
                    />
                </div>
                <div className="button-container">
                    <button>Add</button>
                </div>
            </form> 
        </div>
    )
}*/

