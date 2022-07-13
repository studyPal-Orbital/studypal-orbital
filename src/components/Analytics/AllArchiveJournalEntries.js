import React, { useState, useEffect } from 'react'
import { UserAuth } from '../../context/AuthContext'
import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    orderBy, 
    where
  } from "firebase/firestore"
import ArchiveJournalEntry from './ArchiveJournalEntry'
import { NavLink } from 'react-router-dom'

const AllArchiveJournalEntries = () => {
    const {user}  = UserAuth()
    const [archivedEntries, setArchivedEntries] = useState([])

    /* Retrieve all archived journal entries of user */ 
    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "archive-journal"), where ("uid", "==", user.uid), orderBy('createdAt'))
            console.log("Retrieving archived journal entries")
            const getAllArchivedEntries = onSnapshot(q, (querySnapshot) => {
                let archived = []
                querySnapshot.forEach((doc) => {
                    archived.push({...doc.data(), id: doc.id})
                })
                setArchivedEntries(() => archived)
            })
            return () => {active = false}}
        }, [user.uid])

    return (
        <div className="journal-entries-container">
            <NavLink className="journal-entries-nav-link" to='/analytics'>
                Back
            </NavLink>
            <h1 className="journal-entries-title">Thoughts let go</h1>
            <p className="journal-entries-desc">These are the words of affirmation you told yourself to tide through tough times</p>
            {archivedEntries.map((entry) => (
                <ArchiveJournalEntry
                    title={entry.title}
                    body={entry.body}
                    conclusion={entry.conclusion}
                    id={entry.id}
                />
            ))}
        </div>
    )

}

export default AllArchiveJournalEntries


  

