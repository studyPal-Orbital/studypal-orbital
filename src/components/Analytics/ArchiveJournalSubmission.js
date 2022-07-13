import React from 'react'
import './Journal.css'
import { NavLink } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';

const ArchiveJournalSubmission = () => {
    return (
        <div id='archive-journal-submission'>
            <NavLink className='journal-nav-link' to='/analytics'>
                <CloseIcon className='journal-nav-icon'/>
            </NavLink>
            <p className='journal-submission-text'>Congrats on letting go of your negative emotions!</p>
        </div>
    )
}

export default ArchiveJournalSubmission