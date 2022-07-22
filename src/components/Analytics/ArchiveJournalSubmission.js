import React from 'react'
import './Journal.css'
import { NavLink } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';

const ArchiveJournalSubmission = () => {
    return (
        <div id='archive-journal-submission'>
            <NavLink className='journal-nav-link' to='/analytics' data-cy="close">
                <CloseIcon className='journal-nav-icon'/>
            </NavLink>
            <p className='journal-submission-text' data-cy="thoughts-let-go-journal-text">Congrats on letting go of your negative emotions!</p>
        </div>
    )
}

export default ArchiveJournalSubmission