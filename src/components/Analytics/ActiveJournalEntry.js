import React from "react"; 
import { useState } from "react";
import {db} from "../../firebase.js"
import {
    doc,
    collection,
    addDoc,
    deleteDoc,
    serverTimestamp,
  } from "firebase/firestore"


const ActiveJournalEntry = (props) => {
    const [showContent, setShowContent] = useState(false)

    /* Toggle whether journal card should be expanded to show more content from the journal */
    const showJournalContent = () => {
        setShowContent(() => !showContent)
    }

    /* Delete user selected journal entry from Active store in firebase */
    const deleteEntryFromActive = async (e) => {    
        await deleteDoc(doc(db, "active-journal", props.id))
    }

    /* Add user selected journal entry to Archived store in firebase */
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

    /* Transfer user selected journal entry from Active to Archived store in firebase */
    const handleUserArchiveEntry = async (e) => {
        transferEntryToArchive(e)
        deleteEntryFromActive(e)
    }

    return (
        <div className="created-entries-container">
            <button onClick={showJournalContent} id="active-entries-title">{props.title}</button>   
            {showContent &&  <p className="created-entries-text">{props.body}</p>}
            {showContent &&  <p className="created-entries-text">{props.conclusion}</p>}
            {showContent && <button className="created-entries-button" onClick={handleUserArchiveEntry}>Let go of this thought!</button>}
        </div>
    )
}

export default ActiveJournalEntry