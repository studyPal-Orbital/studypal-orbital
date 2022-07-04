import React, { useEffect } from "react"; 
import { useState } from "react";

import {db} from "../../firebase.js"
import {
    doc,
    collection,
    addDoc,
    deleteDoc,
    serverTimestamp,
  } from "firebase/firestore"


const ActiveJournalEntries = (props) => {
    const [showContent, setShowContent] = useState(false)

    const showJournalContent = () => {
        setShowContent(() => !showContent)
    }

    const deleteEntryFromActive = async (e) => {    
        await deleteDoc(doc(db, "active-journal", props.id))
    }

    const transferEntryToArchive = async (e) => {
        addDoc(collection(db, "archive-journal"), {
            id: props.id,
            title: props.title,
            body: props.body,
            conclusion: props.conclusion,
            uid: props.uid,
            createdAt: serverTimestamp()
        })
    }

    const handleUserArchiveEntry = async (e) => {
        transferEntryToArchive(e)
        deleteEntryFromActive(e)
    }

    console.log(props.id)
    console.log(props.title)

    return (
        <div className="active-entry-container">
            <button onClick={showJournalContent} className="active-entries-title">{props.title}</button>   
            {showContent &&  <p className="active-entries-text">{props.body}</p>}
            {showContent &&  <p className="active-entries-text">{props.conclusion}</p>}
            {showContent && <button className="active-entries-button" onClick={handleUserArchiveEntry}>Let go of this thought!</button>}
        </div>
    )
}

export default ActiveJournalEntries