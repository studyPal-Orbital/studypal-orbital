import React from "react";
import { NavLink } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from "@mui/icons-material/Delete"
import './Abouttodo.css'

const Abouttodo = () => {
    return (
        <div id="abouttodo-container">
            <NavLink id="abouttodo-button" to='/task-tracker'>Back</NavLink>
            <h1 id="abouttodo-title">More information on the task tracker</h1> 
            <div id="all-instructions-container">
                <div className="instruction-container">
                    <DeleteIcon className={"icon"} id="delete"/>
                    <p className="instruction">Click on the delete icon to delete your task<br></br>Each completed and hence deleted task is logged in the activity heatmap</p>
                </div>
                <div className="instruction-container">
                    <CloudUploadIcon className={"icon"} id="save"/>
                    <p className="instruction">Click on the cloudsave edits icon to edit your task and save the edits</p>
                </div>
                <div className="instruction-container">
                    <CheckCircleIcon className={"icon"} id="complete"/>
                    <p className="instruction">Click on the checkmark icon to mark a task as completed with a strikethrough</p>
                </div>
            </div>
        </div>

    )
}

export default Abouttodo