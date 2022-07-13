import React, { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import { UserAuth } from '../../context/AuthContext'
import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    orderBy, 
    where
  } from "firebase/firestore"
import ActiveJournalEntry from './ActiveJournalEntry';

const AllActiveJournalEntries = () => {
    const {user} = UserAuth()
    const [activeEntries, setActiveEntries] = useState([])

    /* Retrieve all active journal entries of user */ 
    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "active-journal"), where ("uid", "==", user.uid), orderBy('createdAt'))
            console.log("Retrieving active journal entries")
            const getAllArchivedEntries = onSnapshot(q, (querySnapshot) => {
                let activeEntriesCollected = []
                querySnapshot.forEach((doc) => {
                    activeEntriesCollected.push({...doc.data(), id: doc.id})
                })
                setActiveEntries(() => activeEntriesCollected)
            })
            return () => {active = false}}
    }, [user.uid])

    return (
        <div className="journal-entries-container">
            <NavLink className="journal-entries-nav-link" to='/analytics'>
                Back
            </NavLink>
            <h1 className="journal-entries-title">Thoughts kept</h1>
            <p className="journal-entries-desc">Let go of these thoughts when you have overcome your worries!</p>
            {activeEntries.map((entry) => (
                <ActiveJournalEntry
                    title={entry.title}
                    body={entry.body}
                    conclusion={entry.conclusion}
                    id={entry.id}
                    uid={user.uid}
                />
            ))}
        </div>
    )
}

export default AllActiveJournalEntries

