import React from 'react'
import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { db } from "../../firebase"
import { collection, 
         setDoc,
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

    /* Record user input post title */
    const setNewPostTitle = (e) => {
        setPostTitle(() => e.target.value)
    }

    /* Record user input post body */
    const setNewPostBody = (e) => {
        setPostBody(() => e.target.value)
    }
    
    /* Save user created post to firebase */
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
        <div id="create-post-container">
            <h2 id="create-post-heading">Create a post</h2>
            <div id="create-post-input-container">
                <textarea
                    className="create-post"
                    id="create-post-title"
                    value={postTitle}
                    onChange={setNewPostTitle}
                    placeholder={"Title of post"}
                />
                <textarea
                    className="create-post"
                    id="create-post-body"
                    value={postBody}
                    onChange={setNewPostBody}
                    placeholder={"Write down your thoughts here :)"}
                />
            </div>
            <div id="buttons-container">
                <button className="button-create-post-page">
                    <NavLink 
                    id="nav-link-back-to-forum"
                    to='/forum'>Back to forum</NavLink>
                </button>
                <button className="button-create-post-page" onClick={createPost}>
                    Create Post   
                </button>
            </div>
        </div>
    )
}


export default CreatePost


   

  

