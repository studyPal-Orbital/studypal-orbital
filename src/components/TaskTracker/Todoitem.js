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
    setDoc,
    deleteDoc,
    where,
    QuerySnapshot,
    addDoc
  } from "firebase/firestore"
import { UserAuth } from "../../context/AuthContext.js"
import { faTruckMedical } from "@fortawesome/free-solid-svg-icons"
import { ConstructionOutlined } from "@mui/icons-material"


const Todoitem = (props)  => {

  const {user} = UserAuth()

  const [currentTask, setCurrentTask] = useState("")
  const [currentRecords, setCurrentRecords] = useState([])

  useEffect(() => {
    let active = true
    if (active == true & user.uid != null) {
      const q = query(collection(db, "todos-record"), where("uid", "==", user.uid))
      console.log("Retrieving task records")
      const getAllRecords = onSnapshot(q, (querySnapshot) => {
        let records = []
        querySnapshot.forEach((doc) => {
          records.push({...doc.data()})
        })
        setCurrentRecords(() => records)
      })
      return () => {active = false}}
  }, [user.uid])

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id))

    let currentDate = new Date().toISOString().split('T')[0].toString()
    let currentRec = currentRecords.filter((rec) => rec['record'][0]['date'] == currentDate)
    let newCount = currentRec.length == 1 ? currentRec[0]['record'][0]['count'] + 1 : 1
    let newRecord = {
      uid: user.uid,
      record: [{date: currentDate, count: newCount}]
    }
    await setDoc(doc(db, "todos-record", user.uid), newRecord)
  }
  

  const handleEdit = async (id, task) => {
    await updateDoc(doc(db, "todos", id), {task: task})
  }

  const toggleComplete = async (id, completed) => {
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

