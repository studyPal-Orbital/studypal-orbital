import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { db } from "../../firebase"
import { collection, 
         addDoc, 
         updateDoc, 
         serverTimestamp } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'

const CreatePost = () => {

    const { user } = UserAuth()

    const [postTitle, setPostTitle] = useState("")
    const [postBody, setPostBody] = useState("")

    const setNewPostTitle = (e) => {
        setPostTitle(() => e.target.value)
    }

    const setNewPostBody = (e) => {
        setPostBody(() => e.target.value)
    }
    
    const createPost = async (e) => {
        if (postTitle != "" && postBody != "") {
            await addDoc(collection(db, "posts"), {
                title: postTitle,
                body: postBody,
                createdAt: serverTimestamp(),
                uid: user.uid,
                email: user.email,
                comments: ["comment1", "comment2"]
            })
            setPostTitle(() => "")
            setPostBody(() => "")
        }
    }

    return (
        <div>
            <textarea
                value={postTitle}
                onChange={setNewPostTitle}
            />
            <textarea
                value={postBody}
                onChange={setNewPostBody}
            />
            <button>
                <NavLink 
                className="nav-link"
                to='/achievements'>Back</NavLink>
            </button>
            <button onClick={createPost}>Create Post</button>
        </div>
    )
}


export default CreatePost


   

  

