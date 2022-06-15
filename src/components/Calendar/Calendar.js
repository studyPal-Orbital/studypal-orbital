import Title from '../Title.js'
import Addtodo from './Addtodo.js'
import Todoitem from './Todoitem.js'

import { db } from "../../firebase"

import { async } from "@firebase/util"
import { doc, setDoc, addDoc, collection, query, where, getDocs, onSnapshot  } from "firebase/firestore"; 
import { useEffect, useState } from 'react'


import {
    deleteDoc,
  } from "firebase/firestore"
// Add a new document in collection "cities"


const Calendar = () => {
    const [tasks, setTasks] = useState([])
    
    useEffect((e) => {
        let ignore = false
        const q = query(collection(db, "todos"))
        const getAllTasks = onSnapshot(q, (querySnapshot) => {
            let newTasks = []
            querySnapshot.forEach((doc) => {
                newTasks.push({...doc.data(), id: doc.id})
            })
            setTasks(() => newTasks)
        })
        console.log(tasks)
        return () => { ignore = true }
    }, [])

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "todos", id));
    };
    

    return (
        <div className='calendar'>
            <Addtodo />
            <Todoitem allTasks={tasks}/>
            {tasks.map((task) => (
                <Todoitem
                    name={task.task}
                    id={task.id}
                    completed={task.completed}
                    delete={handleDelete}
                />
            ))}
        </div> 
    )
}

export default Calendar;



