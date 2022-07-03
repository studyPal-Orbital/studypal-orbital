import React from 'react'
import './Journal.css'

import { NavLink } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';


const ActiveJournalSubmission = () => {
    return (
        <div className='active-journal-submission'>
            <NavLink className='active-journal-redirect-text' to='/analytics'>
                <CloseIcon />
            </NavLink>
            <p className='active-journal-submission-text'>Please rest more and take good care of yourself!</p>
        </div>
    )
}

export default ActiveJournalSubmission