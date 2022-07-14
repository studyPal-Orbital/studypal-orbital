import React from "react";
import { NavLink } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import EditIcon from '@mui/icons-material/Edit';
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
                    <p className="instruction">Click on the trash icon to delete unwanted or completed task.</p>
                </div>
                <div className="instruction-container">
                    <EditIcon className={"icon"} id="save"/>
                    <p className="instruction">Click on the pencil icon to edit your task.</p>
                </div>
                <div className="instruction-container">
                    <CheckCircleIcon className={"icon"} id="complete"/>
                    <p className="instruction">
                        Click on the checkmark icon to mark a task as completed with a strikethrough.
                        <br></br>
                        <br></br>
                        All completed tasks are logged in the activity heatmap, so you can safely delete them.
                    </p>
                </div>
            </div>
        </div>

    )
}

export default Abouttodo