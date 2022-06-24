import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import cat from '../img/bongo-cat.png'
import Comments from './Comments.js'
import { UserAuth } from '../../context/AuthContext'
import { db } from "../../firebase"
import {    doc,
            deleteDoc } from 'firebase/firestore'

import DeleteIcon from "@mui/icons-material/Delete"

const Post = (props) => {
    const {user}  = UserAuth()

    const deletePost = async () => {
        await deleteDoc(doc(db, "posts", props.postID))
    }

    return (
        <div className="post-container">
            <img className="post-user-pic" src={cat}/>
            <div className="post-content-container">
                <div className="post-header-container">
                    <p className="post-user">Posted by : {props.email}</p>
                    <h2 className="post-title">{props.title}</h2>
                </div>
                <p className="post-content">{props.body}</p>
                <NavLink 
                    className="forum-post-comments" 
                    to='/achievements/comments'
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
            {user.uid == props.uid ? 
                <button className="delete-post" onClick={deletePost}>
                    <DeleteIcon/>
                </button> 
                : <></>
            }
        </div>
    )
}

export default Post