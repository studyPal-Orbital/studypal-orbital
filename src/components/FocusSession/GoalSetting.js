import React from "react"
import './FocusSession.css'
import { useState } from "react"
import { UserAuth } from '../../context/AuthContext'
import {db} from "../../firebase.js"
import {
    setDoc,
    doc,
} from "firebase/firestore"

const GoalSetting = ( {text} ) => {
    const {user}  = UserAuth();

    const [goal, setGoal] = useState(text)
    const [stickyEditMode, setStickyEditMode] = useState(false)

    const toggleStickyEditMode = () => {
        setStickyEditMode(() => !stickyEditMode)
    }

    /* Record user input in Sticky */
    const recordUserStickyText = (e) => {
        setGoal(() => e.target.value)
    }

    /* Add user saved sticky to firebase */
    const addSticky = async (e) => {
        e.preventDefault()
        let newGoal = {
            content: goal,
            uid: user.uid
        }
        await setDoc(doc(db, "goal", user.uid), newGoal)
        toggleStickyEditMode()
    }

    return (
        <>
        <form>
            {!stickyEditMode &&
            <>
                <button 
                    id="sticky-button" 
                    onClick={toggleStickyEditMode}
                    data-cy="edit-sticky"
                >Edit
                </button> 
                <textarea 
                    id="goal-textbox" 
                    disabled="disabled"
                    placeholder="Type your goal for this session."
                    data-cy="non-edit-state-sticky"
                >
                    {goal}
                </textarea>
            </>
            }
            {stickyEditMode &&
            <>
                <button 
                    id="goal-button"
                    onClick={addSticky}
                    data-cy="edit-sticky"
                >Save
                </button> 
                <textarea
                    id="goal-textbox"
                    placeholder="Type your goal for this session."
                    value={goal}
                    onChange={recordUserStickyText}
                    style={{"border": "0.5px solid gray"}}
                    data-cy="edit-state-sticky"
                /> 
            </>
            }
        </form>
    </>
    )
}

export default GoalSetting;