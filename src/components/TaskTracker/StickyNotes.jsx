import React from 'react';
import './StickyNotes.css'

function StickyNotes() {
    return (
        <div className="instructions-container">
            <div className="delete-instruction">
                <p>Click on the “trash” icon to delete task.</p>
            </div>

            <div className="save-instruction">
                <p>Click on the “cloudsave” icon to save edits.</p>
            </div>

            <div className="complete-task-instruction">
                <p>Click on the “tick” icon to strike through completed task.</p>
            </div>
        </div>
    )
}

export default StickyNotes;