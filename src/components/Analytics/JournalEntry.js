import React, { useState } from "react";
import {useNavigate} from "react-router-dom"

import { db } from "../../firebase"
import { collection, 
         addDoc, 
         updateDoc, 
         serverTimestamp } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'

import { NavLink } from "react-router-dom";

const JournalEntry = () => {
    const navigate = useNavigate();

    const {user}  = UserAuth()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [conclusion, setConclusion] = useState("")

    const createJournalTitle = (e) => {
        setTitle(() => e.target.value)
    }

    const createJournalBody = (e) => {
        setBody(() => e.target.value)
    }

    const createJournalConclusion = (e) => {
        setConclusion(() => e.target.value)
    }

    const addNewActiveJournal = async (e) => {
        if (title != "") {
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

    const addNewArchiveJournal = async (e) => {
        if (title != "") {
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
        <div className="journal-entry-container">
            <NavLink to='/analytics'>
                Back
            </NavLink>
            <div className="journal-entry-prompts">
                <p>What is my worry?</p>
                <textarea
                    className={"journal-entry-input"}
                    onChange={createJournalTitle}
                    value={title}
                />
            </div>
            <div className="journal-entry-prompts">
                <p>How likely is it that my worry comes true?</p> 
                <textarea
                    className={"journal-entry-input"}
                    onChange={createJournalBody}
                    value={body}
                />
            </div>
            <div className="journal-entry-prompts">
                <p>If the worst did happen, what can I do to cope?</p>
                <textarea
                    className={"journal-entry-input"}
                    onChange={createJournalConclusion}
                    value={conclusion}
                />
            </div>
            <div className="journal-entry-button-container">
                <button className="journal-entry-button" onClick={addNewArchiveJournal}>
                    I'm ready to let go of my negative thoughts!
                </button>
                <button className="journal-entry-button" onClick={addNewActiveJournal}>
                    I'm not ready to let these thoughts go
                </button>
            </div>
        </div>
    )
}

export default JournalEntry









