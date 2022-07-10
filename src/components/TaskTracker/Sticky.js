import React from "react"
import './Todo.css'

import { useState, useEffect } from "react"

import { UserAuth } from '../../context/AuthContext'

import {db} from "../../firebase.js"
import {
    collection,
    query,
    setDoc,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot,
    serverTimestamp,
    orderBy, 
    where
} from "firebase/firestore"

const Sticky = ( {text} ) => {
    const {user}  = UserAuth()

    const [sticky, setSticky] = useState(text[0]['content'])
    const [stickyEditMode, toggleStickyEditMode] = useState(false)

    const recordUserStickyText = (e) => {
        setSticky(() => e.target.value)
    }

    const addSticky = async () => {
        let newSticky = {
            content: sticky,
            uid: user.uid
        }
        await setDoc(doc(db, "sticky", user.uid), newSticky)
        toggleStickyEditMode(() => !stickyEditMode)      
    }

    return (
        <div className="sticky-container">
            {!stickyEditMode &&
            <>
                <button className="sticky-button" onClick={addSticky}>Edit</button> 
                <textarea 
                    className="sticky-textbox" 
                    disabled="disabled"
                    placeholder="Click Edit and type down your tasks here :)"
                >
                    {sticky}
                </textarea>
            </>
            }
            {stickyEditMode &&
            <>
                <button className="sticky-button" onClick={addSticky}>Save</button> 
                <textarea
                    className="sticky-textbox"
                    placeholder="Type down your tasks here :)"
                    value={sticky}
                    onChange={recordUserStickyText}
                    style={{"border": "0.5px solid gray"}}
                /> 
            </>
            }
        </div>
    )
}

export default Sticky