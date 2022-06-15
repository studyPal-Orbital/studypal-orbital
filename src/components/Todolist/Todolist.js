import Title from '../Title.js'
import AddTodo from './AddTodo.js'
import Todoitem from './Todoitem.js'

import React from "react"
import { useState, useEffect } from "react"

import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot
  } from "firebase/firestore"

  /*
   const q = query(collection(db, "todos"))
      const getAllTasks = onSnapshot(q, (querySnapshot) => {
          let newTasks = []
          querySnapshot.forEach((doc) => {
              newTasks.push({...doc.data(), id: doc.id})
          })*/
  
const Todolist =  () => {
  const [currentTasks, setCurrentTasks] = useState([])

  useEffect((e) => {
    let ignore = false
    const q = query(collection(db, "todos"))
    const getAllTasks = onSnapshot(q, (querySnapshot) => {
      let tasks = []
      querySnapshot.forEach((doc) => {
        tasks.push({...doc.data(), id:doc.id})
      })
      setCurrentTasks(() => tasks)
    })
    return () => {ignore = true}
  },[])

  return (
    <div className="todo-list-main">
      <Title name={"Todo List"}/>
      <AddTodo />
      {currentTasks.map((todo) => (
        <Todoitem 
          item={todo}
        />
      ))}
    </div>
  )
}

export default Todolist

/*
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

*/
