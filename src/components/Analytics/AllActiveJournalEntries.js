import React, { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import { UserAuth } from '../../context/AuthContext'
import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot,
    orderBy, 
    where
  } from "firebase/firestore"
import ActiveJournalEntries from './ActiveJournalEntries';

const AllActiveJournalEntries = () => {
    const {user} = UserAuth()

    const [activeEntries, setActiveEntries] = useState([])
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
        <div className="active-entries-container">
            <NavLink to='/analytics'>
                Back
            </NavLink>
            <h1>Thoughts kept</h1>
            <p>Let go of these thoughts when you have overcome your worries!</p>
            {activeEntries.map((entry) => (
                <ActiveJournalEntries
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

