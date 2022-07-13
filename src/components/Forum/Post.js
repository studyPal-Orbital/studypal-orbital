import React from 'react'
import { NavLink } from 'react-router-dom'

import cat from '../img/bongo-cat.png'
import { UserAuth } from '../../context/AuthContext'
import { db } from "../../firebase"
import { doc,
         deleteDoc } from 'firebase/firestore'
import DeleteIcon from "@mui/icons-material/Delete"

const Post = (props) => {
    const {user}  = UserAuth()

    /* Delete user selected post from firebase */
    const deletePost = async () => {
        await deleteDoc(doc(db, "posts", props.postID))
    }

    return (
        <div id="post-container">
            <div id="post-user-details-container">
                <img id="post-user-pic" src={cat}/>
                {user.uid == props.uid ? 
                    <button id="delete-post" onClick={deletePost}>
                        <DeleteIcon/>
                    </button> 
                    : <></>
                }
            </div>
            <div id="post-content-container">
                <div id="post-header-container">
                    <p id="post-user">Posted by : {props.displayName}</p>
                    <h2 id="post-title">{props.title}</h2>
                </div>
                <p id="post-content">{props.body}</p>
                <NavLink 
                    id="forum-post-comments-nav-link" 
                    to='/forum/comments'
                    state={{ id: props.id,
                             comments: props.comments,
                             email: props.email,
                             title: props.title,
                             body: props.body
                            }}
                    >
                    Show comments  
                </NavLink>
            </div> 
        </div>
    )
}

export default Post