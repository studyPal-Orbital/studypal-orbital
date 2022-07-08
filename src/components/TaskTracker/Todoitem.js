import React from "react"
import { useState, useEffect } from "react"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

const Todoitem = (props)  => {

  const {user} = UserAuth()

  const [currentTask, setCurrentTask] = useState("")
  const [currentRecords, setCurrentRecords] = useState([])
  let currentDate = new Date().toISOString().split('T')[0].toString()
  let newRecordID = currentDate + '-' + user.uid

  useEffect(() => {
    let active = true
    if (active == true & user.uid != null) {
      const q = query(collection(db, "todos-record"), where("recordID", "==", newRecordID))
      console.log("Retrieving task records")
      const getAllRecords = onSnapshot(q, (querySnapshot) => {
        let records = []
        querySnapshot.forEach((doc) => {
          records.push({...doc.data()})
        })
        setCurrentRecords(() => records)
        console.log(records)
      })
      return () => {active = false}}
  }, [user.uid])

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id))

    let currentRec = currentRecords.filter((rec) => rec['recordID'] == newRecordID)
    let newDate = currentRec.length == 1 ? currentRec[0]['date'] : currentDate
    let newCount = currentRec.length == 1 ? currentRec[0]['count'] + 1 : 1
    let newRecord = {
      uid: user.uid,
      recordID: newRecordID,
      date: newDate,
      count: newCount
    }
    await setDoc(doc(db, "todos-record", newRecordID), newRecord)
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
    /* NOTE: Items can be dragged but new order is not saved. */
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
          <CloudUploadIcon id={"i"}/>
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
    /*
    let currentRec = currentRecords.filter((rec) => rec['record'][0]['date'] == currentDate)
    let newDate = currentRec.length == 1 ? currentRec[0]['record'][0]['date'] : currentDate
    let newCount = currentRec.length == 1 ? currentRec[0]['record'][0]['count'] + 1 : 1
    let newRecord = {
      uid: user.uid,
      record: [{date: newDate, count: newCount}]
    }
   
    currentRec[0]['record'].push(newRecord)
    console.log(currentRec)

    await setDoc(doc(db, "todos-record", user.uid), newRecord)*/