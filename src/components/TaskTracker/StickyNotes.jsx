import React from 'react';

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from "@mui/icons-material/Delete"

import './StickyNotes.css'

function StickyNotes() {
    return (
        <div className="instructions-container">
            <div className="delete-instruction">
                <DeleteIcon id={"i"}/>
                <p>Delete Task</p>
            </div>

            <div className="save-instruction">
                <CloudUploadIcon id={"i"}/>
                <p>Cloudsave Edits</p>
            </div>

            <div className="complete-task-instruction">
                <CheckCircleIcon id={"i"}/>
                <p>Complete Task</p>
            </div>
        </div>
    )
}

export default StickyNotes;