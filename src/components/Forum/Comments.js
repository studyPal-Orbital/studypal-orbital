import React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { db } from "../../firebase"
import { UserAuth } from '../../context/AuthContext'
import {
    collection,
    query,
    onSnapshot,
    orderBy, 
    where
    } from "firebase/firestore"
import { useLocation } from 'react-router-dom';
import CreateComment from './CreateComment'
import Comment from './Comment'
import './Comments.css'

const Comments = () => {

    const {user}  = UserAuth()

    const location = useLocation()
    const id  = location.state.id
    const comments = location.state.comments
    const email = location.state.email
    const postTitle = location.state.title
    const postBody = location.state.body

    const [currentComments, setCurrentComments] = useState([])

    /* Retrieve all comments for the current post */
    useEffect(() => {
      let active = true
      if (active == true && user.uid != null) {
        const q = query(collection(db, "comments"), where ("postID", "==", id), orderBy('createdAt'))
        console.log("Retrieving comments list")
        const getAllComments = onSnapshot(q, (querySnapshot) => {
          let comments = []
          querySnapshot.forEach((doc) => {
            comments.push({...doc.data(), id: doc.id})
          })
          setCurrentComments(() => comments)
        })
        return () => {active = false}}
      }, [user.uid])

    return (
        <div id="comments-container" data-cy="comments">
          <div id="comments-desc-container">
              <NavLink id="comments-nav-link" data-cy="nav-back-to-forum" to='/forum'>
                Back        
              </NavLink>
              <h2 id="comments-page-post-title">{postTitle}</h2>
              <p id="comments-page-post-body">{postBody}</p>
          </div>
          <div id="create-comment-container">
            <CreateComment 
                post={id}
            />
          </div>
            <section id="current-comments-container">
              {currentComments.map((item) => (
                <Comment 
                  comment={item.comment}
                  displayName={item.displayName}
                  className="current-comments"
                  id={item.id}
                  userID={item.uid}
                />
              ))}
            </section>
        </div>
    )
}

export default Comments;