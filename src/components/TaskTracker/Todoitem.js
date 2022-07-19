import React from "react";
import { useState, useEffect } from "react";
import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    where,
  } from "firebase/firestore"
import { UserAuth } from "../../context/AuthContext.js"
import { NavLink } from "react-router-dom";
import './Todo.css'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from "@mui/icons-material/CheckCircle"


const Todoitem = ({title, body, urgency, completed, createdAt, id}) => {
    const { user } = UserAuth()
    let currentDate = new Date().toISOString().split('T')[0].toString()
    let newRecordID = currentDate + '-' + user.uid

    const [showContent, setShowContent] = useState(false)
    const [complete, setComplete] = useState(completed)
    const [currentRecords, setCurrentRecords] = useState([])

    /* Retrieving task created */
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

    /* Delete user selected task */
    const handleDelete = async () => {
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

    /* Expand task card to show task description */
    const toggleShowContent = () => {
        setShowContent(() => !showContent)
    }

    /* Toggle status of completion for user selected task */
    const toggleComplete = async () => {
      setComplete(() => !complete)
      await updateDoc(doc(db, "todos", id), {completed: !complete})
    }
  
    return (
        <>
            <div id="display-todo-title-container">
              <div id="display-todo-first-row">
                <p 
                    id={"display-task-title"}
                    style={{ textDecoration: complete && "line-through" }}
                    data-cy="task-title"
                  >
                    {title}
                  </p>
                  <p id="display-task-urgency"
                        style={{ backgroundColor: urgency == "Low" ? "rgb(109, 209, 125)" : 
                                                  urgency == "Medium" ? "rgb(255, 193, 77)" : "rgb(238, 80, 63)"}}>
                        {urgency}
                  </p>
              </div>
                <div id="display-task-control-container">
                  <div className="display-task-control" onClick={handleDelete}>
                      <DeleteIcon className="todo-icon" data-cy="delete-tasks"/>
                  </div>
                  <NavLink className="display-task-control" to="/edit-todo" state={{ title, body, urgency, completed, createdAt, id }}>
                      <EditIcon className="todo-icon" data-cy="edit-tasks"/>
                  </NavLink>
                  <div className="display-task-control" onClick={toggleComplete}>
                      <CheckCircleIcon className="todo-icon" data-cy="toggle-tasks"/>
                  </div>
                  <div className="display-task-control" onClick={toggleShowContent}>
                    <ExpandMoreIcon className="todo-icon" data-cy="expand-tasks"/>
                  </div>
              </div>
              </div>
            {showContent && <p id="display-task-description">{body == "" ? "No description provided" : body}</p>}
        </>
    )
}

export default Todoitem