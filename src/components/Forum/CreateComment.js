import React from "react"

import { useState } from "react"

import { db } from "../../firebase"
import { collection, 
         addDoc, 
         updateDoc, 
         serverTimestamp } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'
import { PropaneSharp } from "@mui/icons-material"

const CreateComment = (props) => {
    const { user } = UserAuth()

    const [comment, setComment] = useState("")

    const setNewComment = (e) => {
        setComment(() => e.target.value)
    }

    const createComment = async (e) => {
        if (comment != "") {
            await addDoc(collection(db, "comments"), {
                comment: comment,
                createdAt: serverTimestamp(),
                uid: user.uid,
                email: user.email,
                postID : props.post
            })
            setComment(() => "")
        }
    }

    return (
        <div>
            <div>
                <textarea
                    placeholder="comment"
                    value={comment}
                    onChange={setNewComment}
                />
                <button onClick={createComment}>
                    Submit comment
                </button>
            </div>
        </div>
    )
}

export default CreateComment