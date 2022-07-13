import React from "react"
import './Todo.css'
import { useState } from "react"
import { UserAuth } from '../../context/AuthContext'
import {db} from "../../firebase.js"
import {
    setDoc,
    doc,
} from "firebase/firestore"

const Sticky = ( {text} ) => {
    const {user}  = UserAuth()

    const [sticky, setSticky] = useState(text)
    const [stickyEditMode, toggleStickyEditMode] = useState(false)

    /* Record user input in Sticky */
    const recordUserStickyText = (e) => {
        setSticky(() => e.target.value)
    }

    /* Add user saved sticky to firebase */
    const addSticky = async (e) => {
        e.preventDefault()
        let newSticky = {
            content: sticky,
            uid: user.uid
        }
        await setDoc(doc(db, "sticky", user.uid), newSticky)
        toggleStickyEditMode(() => !stickyEditMode)      
    }

    return (
        <>
        <form>
            {!stickyEditMode &&
            <>
                <button id="sticky-button" onClick={addSticky}>Edit</button> 
                <textarea 
                    id="sticky-textbox" 
                    disabled="disabled"
                    placeholder="Click Edit and type down your tasks here :)"
                >
                    {sticky}
                </textarea>
            </>
            }
            {stickyEditMode &&
            <>
                <button id="sticky-button" onClick={addSticky}>Save</button> 
                <textarea
                    id="sticky-textbox"
                    placeholder="Type down your tasks here :)"
                    value={sticky}
                    onChange={recordUserStickyText}
                    style={{"border": "0.5px solid gray"}}
                /> 
            </>
            }
        </form>
    </>
    )
}

export default Sticky