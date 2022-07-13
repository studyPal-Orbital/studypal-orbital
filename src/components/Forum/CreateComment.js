import React from "react"
import { useState } from "react"
import { db } from "../../firebase"
import { collection, 
         addDoc, 
         serverTimestamp } from "firebase/firestore"
import { UserAuth } from '../../context/AuthContext'

const CreateComment = (props) => {
    const { user } = UserAuth()
    const [comment, setComment] = useState("")

    /* Record user input comment */
    const setNewComment = (e) => {
        setComment(() => e.target.value)
    }

    /* Save user input comment to firebase */
    const createComment = async (e) => {
        if (comment != "") {
            await addDoc(collection(db, "comments"), {
                comment: comment,
                createdAt: serverTimestamp(),
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                postID : props.post
            })
            setComment(() => "")
        }
    }

    return (
    <div id="create-comment-container">
        <textarea
            placeholder="Leave a comment"
            value={comment}
            onChange={setNewComment}
            id="create-comment-input"
        />
        <button id="submit-comment-button" onClick={createComment}>
            Submit
        </button>
    </div>
    )
}

export default CreateComment