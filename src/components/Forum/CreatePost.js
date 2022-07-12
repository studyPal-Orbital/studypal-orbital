import React from 'react'
import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

import { db } from "../../firebase"
import { collection, 
         addDoc, 
         setDoc,
         updateDoc, 
         serverTimestamp, 
         doc } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'

import './CreatePost.css'

const CreatePost = () => {

    const { user } = UserAuth()
    const location = useLocation()
    const navigate = useNavigate();

    const [postTitle, setPostTitle] = useState("")
    const [postBody, setPostBody] = useState("")

    const setNewPostTitle = (e) => {
        setPostTitle(() => e.target.value)
    }

    const setNewPostBody = (e) => {
        setPostBody(() => e.target.value)
    }
    
    const createPost = async (e) => {
        const docRef = doc(collection(db, "posts"))
        if (postTitle != "" && postBody != "") {
            let newDoc = {
                title: postTitle,
                body: postBody,
                createdAt: serverTimestamp(),
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                comments: ["comment1", "comment2"],
                postID: docRef.id
            }
            setPostTitle(() => "")
            setPostBody(() => "")
            await setDoc(doc(db, "posts", docRef.id), newDoc)   
            alert("Post created! :)") 
            navigate('/forum')
        } else {
            alert("Please fill in both post title and post body")
        }
    }

    return (
        <div className="create-post-container">
            <h2 className="create-post-heading">Create a post</h2>
            <div className="create-post-input-container">
                <textarea
                    className="create-post-title"
                    value={postTitle}
                    onChange={setNewPostTitle}
                    placeholder={"Title of post"}
                />
                <textarea
                    className="create-post-body"
                    value={postBody}
                    onChange={setNewPostBody}
                    placeholder={"Write down your thoughts here :)"}
                />
            </div>
            <div className="buttons-container">
                <button className="button-create-post-page">
                    <NavLink 
                    className="nav-link-back-to-forum"
                    to='/forum'>Back</NavLink>
                </button>
                <button className="button-create-post-page" onClick={createPost}>
                    Create Post   
                </button>
            </div>
        </div>
    )
}


export default CreatePost


   

  

