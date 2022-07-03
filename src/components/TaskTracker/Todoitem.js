import React from "react"
import { useState, useEffect } from "react"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

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


const Todoitem = (props)  => {

  const [currentTask, setCurrentTask] = useState("")

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id))
  }

  const handleEdit = async (id, task) => {
    await updateDoc(doc(db, "todos", id), {task: task})
  }

  const toggleComplete = async(id, completed) => {
    await updateDoc(doc(db, "todos", id), {completed: !completed})
  }

  const handleCurrentTaskChange = (e) => {
    setCurrentTask(() => e.target.value)
  }

  return (
    <div className="todo-item" draggable>
      <input
        className={"todo-item-input-field"}
        value={currentTask == "" ? props.item.task : currentTask}
        onChange={handleCurrentTaskChange}
        style={{ textDecoration: props.item.completed && "line-through" }}
      />
      <div className="todo-buttons">
        <button className="todo-item-delete-button" onClick={() => handleDelete(props.item.id)}>
          <DeleteIcon id={"i"}/>
        </button>   
        <button className="todo-item-edit-button" onClick={() => handleEdit(props.item.id, currentTask)}>
          <EditIcon id={"i"}/>
        </button>
        <button className="todo-item-mark-complete-button" onClick={() => toggleComplete(props.item.id, props.item.completed)}>
          <CheckCircleIcon id={"i"}/>
        </button>
      </div>
    </div>
  
  )
}

export default Todoitem 


/*

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleEdit = async (id, task) => {
    await updateDoc(doc(db, "todos", id), { task: task });
  };

  */