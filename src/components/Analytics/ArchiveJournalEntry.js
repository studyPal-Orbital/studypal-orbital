import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import {db} from "../../firebase.js"
import {
    doc,
    collection,
    addDoc,
    deleteDoc,
    serverTimestamp,
  } from "firebase/firestore"


const ArchiveJournalEntry = (props) => {    
    const [clicked, setClicked] = useState(false)

    const toggleEntry = () => {
        setClicked(() => !clicked)
    }

    const deleteEntryFromArchive = async (e) => {
        await deleteDoc(doc(db, "archive-journal", props.id))
    }

    return (
        <div className="archived-entry-container">
            <button onClick={toggleEntry} className="archived-entries-conclusion">{props.conclusion}</button>
            {clicked && <p className="archived-entries-text">{props.title}</p>}
            {clicked && <p className="archived-entries-text">{props.body}</p>}
            {clicked && <button className="archived-entries-button" onClick={deleteEntryFromArchive}>Delete</button>}
        </div>
    )
}

export default ArchiveJournalEntry