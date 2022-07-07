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

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

const Achievements = () => {

    const {user}  = UserAuth()

    const [ currentPosts, setCurrentPosts ] = useState([])
    const [ currentPostTitles, setCurrentPostTitles ] = useState([])
    const [ currentTitleSearched, setCurrentTitleSearched ] = useState("")
    const [ currentTitleSelected, setCurrentTileSelected ] = useState("")

    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "posts"), orderBy('createdAt'))
            console.log("Retrieving posts")
            const getAllPosts = onSnapshot(q, (querySnapshot) => {
                let posts = []
                let titles = []
                querySnapshot.forEach((doc) => {
                    posts.push({...doc.data(), id:doc.id})
                    titles.push(doc.data().title)
                })
                setCurrentPosts(() => posts)
                setCurrentPostTitles(() => titles)
                console.log(titles)
            })
            return () => {active = false}}
    }, [user.uid])

    const logUserInput = (e) => {
        setCurrentTitleSearched(() => e.target.value)
    }

    const logUserInputSelection = (e) => {
        setCurrentTileSelected(() => e.target.value)
    }

    const resetUserInputSelection = (e) => {
        setCurrentTileSelected(() => "")
    }

    return (
        <div>
            <Header />
            <Title name={"Forum"} />
            <div className="forum">
                <div className="forum-side-bar">
                    <NavLink 
                        className="nav-link-forum"
                        to='/forum/canvas'>View Collaborative canvas
                    </NavLink>
                    <NavLink 
                        className="nav-link-forum"
                        to='/forum/createpost'>Create Post
                    </NavLink>
                </div>
                <div className="forum-post-feed">
                    <div className="forum-search-bar-container">
                        <input
                            className={"forum-search-bar"}
                            placeholder={"Search for a post"}
                            value={currentTitleSearched}
                            onChange={logUserInput}
                        />
                        <button className="refresh-button" onClick={resetUserInputSelection}> 
                            <RefreshIcon /> 
                        </button>
                    </div>
                    <div className="forum-search-results-container">
                        {currentTitleSearched != "" && currentPostTitles.map((title) => {
                            if (title.toLocaleLowerCase().match(currentTitleSearched.toLocaleLowerCase())) {
                                return <button className={"forum-search-results"} value={title} onClick={logUserInputSelection}>
                                    <SearchIcon className="forum-search-results-icon" />
                                    {title}
                                    </button>
                            }})
                        }
                    </div>

                    {currentPosts.map((post) => {
                        if (post.title == currentTitleSelected & currentTitleSelected != "") {
                        return <Post 
                            email={post['email']}
                            title={post['title']}
                            body={post['body']}
                            id={post['id']}
                            comments={post['comments']}
                            uid={post['uid']}
                            postID={post['postID']}
                        />
                        } else if (currentTitleSelected == "" ) {
                            return <Post 
                            email={post['email']}
                            title={post['title']}
                            body={post['body']}
                            id={post['id']}
                            comments={post['comments']}
                            uid={post['uid']}
                            postID={post['postID']}
                        />
                        }
                    })}
                </div>
            </div> 
        </div>
    )
}

export default Achievements

