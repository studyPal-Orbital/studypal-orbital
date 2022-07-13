import React from "react";
import { useState } from "react";
import {db} from "../../firebase.js"
import {
    doc,
    deleteDoc,
} from "firebase/firestore"

const ArchiveJournalEntry = (props) => {    
    const [clicked, setClicked] = useState(false)

    /* Toggle whether journal card should be expanded to show more content from the journal */
    const toggleEntry = () => {
        setClicked(() => !clicked)
    }

    /* Delete user selected journal entry from firebase */
    const deleteEntryFromArchive = async (e) => {
        await deleteDoc(doc(db, "archive-journal", props.id))
    }

    return (
        <div className="created-entries-container">
            <button onClick={toggleEntry} id="archived-entries-title">{props.conclusion}</button>
            {clicked && <p className="created-entries-text">{props.title}</p>}
            {clicked && <p className="created-entries-text">{props.body}</p>}
            {clicked && <button className="created-entries-button" onClick={deleteEntryFromArchive}>Delete</button>}
        </div>
    )
}

export default ArchiveJournalEntry