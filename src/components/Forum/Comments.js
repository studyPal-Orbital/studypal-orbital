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

const Comments = () => {

    const {user}  = UserAuth()

    const location = useLocation()
    const id  = location.state.id
    const comments = location.state.comments

    const [currentComments, setCurrentComments] = useState([])

    useEffect(() => {
      let active = true
      if (active == true && user.uid != null) {
        const q = query(collection(db, "comments"), where ("postID", "==", id))
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

    console.log(currentComments)

    return (
        <div>
            <p>Hello</p>
            <NavLink className="back-to-home-page-from-comments" to='/achievements'>
                    Back        
            </NavLink>
            <CreateComment 
              post={id}
            />
            {currentComments.map((item) => (
              <Comment 
                comment={item.comment}
                email={item.email}
              />
            ))}
        </div>
    )

}

export default Comments;