import Title from '../Title/Title.js'
import AddTodo from './AddTodo.js'
import Todoitem from './Todoitem.js'
import CalendarScheduler from './CalendarScheduler'
import Header from '../Header/Header.js'

import React from "react"
import { useState, useEffect } from "react"

import './Todolist.css'

import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot,
    orderBy
  } from "firebase/firestore"


const Todolist =  () => {
  const [currentTasks, setCurrentTasks] = useState([])
  
  useEffect(() => {
    let active = true
    if (active == true) {
      const q = query(collection(db, "todos"), orderBy('createdAt'))
      const getAllTasks = onSnapshot(q, (querySnapshot) => {
      let tasks = []
      querySnapshot.forEach((doc) => {
        tasks.push({...doc.data(), id:doc.id})
      })
      setCurrentTasks(() => tasks)
      console.log(currentTasks)

    })}
    return () => {active = false}
  },[])

  console.log(currentTasks)

  return (
    <div className="todo-list-main">
      <Header />
      <Title name={"Task Tracker"}/>
      <div className="todo-list-calender">
        <div className="todo-list-container">
          <AddTodo />
            {currentTasks.map((todo) => (
              <Todoitem 
                item={todo}
              />
            ))}
        </div>
        <div className="calendar-container">
          <CalendarScheduler />
        </div>
        </div>
      </div>
  )
}

export default Todolist
