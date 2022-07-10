import Title from '../Title/Title.js'
import AddTodo from './AddTodo.js'
import Todoitem from './Todoitem.js'
import CalendarScheduler from './CalendarScheduler'
import Header from '../Header/Header.js'
import StickyNotes from './StickyNotes.jsx'

import React from "react"
import { useState, useEffect } from "react"

import './TaskTracker.css'

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

import { NavLink } from 'react-router-dom'


const Todolist =  () => {

  const {user}  = UserAuth()
  const [currentTasks, setCurrentTasks] = useState([])
  useEffect(() => {
    let active = true
    if (active == true && user.uid != null) {
      const q = query(collection(db, "todos"), where ("uid", "==", user.uid), orderBy('createdAt'))
      console.log("Retrieving task list")
      const getAllTasks = onSnapshot(q, (querySnapshot) => {
      let tasks = []
      querySnapshot.forEach((doc) => {
        tasks.push({...doc.data(), id:doc.id})
        console.log(doc.data())
      })
      setCurrentTasks(() => tasks)
      console.log(currentTasks)

    })
    return () => {active = false}}
  },[user.uid])

  return (
    <div className="todo-list-main">
      <Header />
      <Title name={"Task Tracker"}/>
      <div className="todo-list-calender">
        <div className="todo-list-container">
          <div className="todo-list-instructions">
            <StickyNotes />
        { /* 
            <h4>Instructions</h4>
            <p>Click on the “trash” icon to delete task.</p>
            <p>Click on the “cloudsave” icon to save edits.</p>
            <p>Click on the “tick” icon to strike through completed task.</p>
        */}
          </div>
        
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
