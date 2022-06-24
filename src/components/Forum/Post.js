import React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import cat from '../img/bongo-cat.png'
import Comments from './Comments.js'

const Post = (props) => {
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
                    className="post-comments" 
                    to='/achievements/comments'
                    state={{ id: props.id,
                             comments: props.comments
                            }}
                    >
                    Show comments  
                </NavLink>
            </div> 
        </div>
    )
}

export default Post