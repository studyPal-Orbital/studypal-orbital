import React from "react";
import { NavLink } from "react-router-dom";
import Title from "../Title/Title";

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from "@mui/icons-material/Delete"

import './Abouttodo.css'

const Abouttodo = () => {
    return (
        <div className="abouttodo-container">
            <NavLink className="abouttodo-button" to='/task-tracker'>Back</NavLink>
            <div className="instructions-container">
                <h1 className="abouttodo-title">More information on the task tracker</h1> 
                <div className="delete-instructions-container">
                    <div className="delete-instruction">
                        <DeleteIcon id={"i"}/>
                        <p>Delete Task</p>
                    </div>
                    <p className="instructions-elab">Click on the delete icon to delete your task<br></br>Each completed and hence deleted task is logged in the activity heatmap</p>
                </div>
                <div className="save-instructions-container">
                    <div className="save-instruction">
                        <CloudUploadIcon id={"i"}/>
                        <p>Save Task</p>
                    </div>
                    <p className="instructions-elab">Click on the cloudsave edits icon to edit your task and save the edits</p>
                </div>
                <div className="complete-instructions-container">
                    <div className="complete-task-instruction">
                        <CheckCircleIcon id={"i"}/>
                        <p>Complete Task</p>
                    </div>
                    <p className="instructions-elab">Click on the checkmark icon to mark a task as completed with a strikethrough</p>
                </div>
            </div>
        </div>

    )
}

export default Abouttodo