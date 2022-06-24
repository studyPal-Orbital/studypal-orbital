import React from 'react'
import Header from '../Header/Header.js'
import Title from '../Title/Title.js'
import Post from './Post.js'

import { NavLink } from 'react-router-dom'
import { useState, useEffect } from "react"

import { UserAuth } from '../../context/AuthContext'

import {db} from "../../firebase.js"
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

import './Forum.css'

const Achievements = () => {

    const {user}  = UserAuth()

    const[currentPosts, setCurrentPosts] = useState([])

    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "posts"), orderBy('createdAt'))
            console.log("Retrieving posts")
            const getAllPosts = onSnapshot(q, (querySnapshot) => {
                let posts = []
                querySnapshot.forEach((doc) => {
                    posts.push({...doc.data(), id:doc.id})
                    console.log(doc.data())
                })
                setCurrentPosts(() => posts)
            })
            return () => {active = false}}
    }, [user.uid])
        
    return (
        <div>
            <Header />
            <Title name={"Forum"} />
            <div className="forum">
                <div className="forum-side-bar">
                    <NavLink 
                        className="nav-link-forum"
                        to='/achievements/canvas'>View Collaborative canvas
                    </NavLink>
                    <NavLink 
                        className="nav-link-forum"
                        to='/achievements/createpost'>Create Post
                    </NavLink>
                </div>
                <div className="forum-post-feed">
                    {currentPosts.map((post) => (
                        <Post 
                            email={post['email']}
                            title={post['title']}
                            body={post['body']}
                            id={post['id']}
                            comments={post['comments']}
                            uid={post['uid']}
                            postID={post['postID']}
                        />
                    ))}
                </div>
            </div> 
        </div>
    )
}

export default Achievements

