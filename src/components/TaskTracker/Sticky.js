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
    const [stickyEditMode, setStickyEditMode] = useState(false)

    const toggleStickyEditMode = () => {
        setStickyEditMode(() => !stickyEditMode)
    }

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
        toggleStickyEditMode()
    }

    return (
        <>
        <form>
            {!stickyEditMode &&
            <>
                <button id="sticky-button" onClick={toggleStickyEditMode}>Edit</button> 
                <textarea 
                    id="sticky-textbox" 
                    disabled="disabled"
                    placeholder=""
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