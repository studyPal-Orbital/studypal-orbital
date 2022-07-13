import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import { db } from "../../firebase"
import { collection, 
         addDoc, 
         serverTimestamp } from "firebase/firestore"
import { UserAuth } from '../../context/AuthContext'
import { NavLink } from "react-router-dom";

const JournalEntry = () => {
    const navigate = useNavigate();
    const {user}  = UserAuth()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [conclusion, setConclusion] = useState("")

    /* Record user input for journal title */
    const createJournalTitle = (e) => {
        setTitle(() => e.target.value)
    }

    /* Record user input for journal body */
    const createJournalBody = (e) => {
        setBody(() => e.target.value)
    }

    /* Record user input for journal conclusion */
    const createJournalConclusion = (e) => {
        setConclusion(() => e.target.value)
    }

    /* For thoughts kept : Check that user has provided inputs for title, body, conclusion & add user input to firebase */
    const addNewActiveJournal = async (e) => {
        e.preventDefault()
        if (title === "" || body === "" || conclusion === "") {
            alert("You might want to type something for all prompts")
        } else {
            await addDoc(collection(db, "active-journal"), {
                title,
                body,
                conclusion,
                createdAt: serverTimestamp(),
                uid: user.uid
            })
            setTitle(() => "")
            setBody(() => "")
            setConclusion(() => "")
            navigate('/thoughts-kept')
        }
    }

    /* For thoughts let go : Check that user has provided inputs for title, body, conclusion & add user input to firebase */
    const addNewArchiveJournal = async (e) => {
        e.preventDefault()
        if (title === "" || body === "" || conclusion === "") {
            alert("You might want to type something for all prompts")
        } else {
            await addDoc(collection(db, "archive-journal"), {
                title,
                body,
                conclusion,
                createdAt: serverTimestamp(),
                uid: user.uid
            })
            setTitle(() => "")
            setBody(() => "")
            setConclusion(() => "")
            navigate('/thoughts-let-go')
        }
    }

    return (
        <div id="journal-entry-container">
            <NavLink id="journal-entry-nav-link" to='/analytics'>
                Back
            </NavLink>
            <form id="journal-entry">
                <div className="journal-entry-prompts">
                    <label className="journal-entry-label" for="journal-entry-title">What is my worry?</label>
                    <textarea
                        id={"journal-entry-title"}
                        className={"journal-entry-input"}
                        onChange={createJournalTitle}
                        value={title}
                    />
                </div>
                <div className="journal-entry-prompts">
                    <label className="journal-entry-label" for="journal-entry-body">How likely is it that my worry comes true?</label> 
                    <textarea
                        id="journal-entry-body"
                        className={"journal-entry-input"}
                        onChange={createJournalBody}
                        value={body}
                    />
                </div>
                <div className="journal-entry-prompts">
                    <label className="journal-entry-label" for="journal-entry-conclusion">If the worst did happen, what can I do to cope?</label>
                    <textarea
                        id="journal-entry-conclusion"
                        className={"journal-entry-input"}
                        onChange={createJournalConclusion}
                        value={conclusion}
                    />
                </div>
                <div id="journal-entry-button-container">
                    <button className="journal-entry-button" onClick={addNewArchiveJournal}>
                        I'm ready to let go of my negative thoughts!
                    </button>
                    <button className="journal-entry-button" onClick={addNewActiveJournal}>
                        I'm not ready to let these thoughts go
                    </button>
                </div>
            </form>
        </div>
    )
}

export default JournalEntry









