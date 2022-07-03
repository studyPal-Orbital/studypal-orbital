import React from 'react'
import './Journal.css'

import { NavLink } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';

const ArchiveJournalSubmission = () => {
    return (
        <div className='archive-journal-submission'>
            <NavLink className='archive-journal-redirect-text' to='/analytics'>
                <CloseIcon />
            </NavLink>
            <p className='archive-journal-submission-text'>Congrats on letting go of your negative emotions!</p>
        </div>
    )
}

export default ArchiveJournalSubmission