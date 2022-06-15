import { useState } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
import { WifiProtectedSetupSharp } from "@mui/icons-material";

const Todoitem = (props) => {

  const [input, setNewInput] = useState("")

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleEdit = async (id, task) => {
    await updateDoc(doc(db, "todos", id), { task: task });
  };

  const handleNewInput = (e) => {
    setNewInput(() => e.target.value)
  }

  return (
    <div className="task-container">
        <div className="input-container">
          <input 
            className="todo-item"
            type="text"
            value={input === "" ? props.name : input}
            placeholder="task"
            onChange={handleNewInput}
          />
        </div>
        <div className="buttons-container">
          <button className="Delete" onClick={() => handleDelete(props.id)}>
            Delete
          </button>
          <button className="Edit" onClick={() => handleEdit(props.id, input)}>
            Edit
          </button>
        </div>
    </div>
  )
}

export default Todoitem
