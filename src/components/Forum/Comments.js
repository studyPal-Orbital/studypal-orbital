import React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { db } from "../../firebase"
    
import { UserAuth } from '../../context/AuthContext'

import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    QuerySnapshot,
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
        <div className="comments-container">
          <div>
          < NavLink className="back-to-home-page-from-comments" to='/achievements'>
                    Back        
            </NavLink>
            <h2 className="post-title-in-comment-page">{postTitle}</h2>
            <p className="post-body-in-comment-page">{postBody}</p>
          </div>
            <CreateComment 
              post={id}
            />
            <div ClassName="current-comments-container">
              {currentComments.map((item) => (
                <Comment 
                  comment={item.comment}
                  email={item.email}
                  className="current-comments"
                  id={item.id}
                  userID={item.uid}
                />
              ))}
            </div>
        </div>
    )

}

export default Comments;