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
    orderBy
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

    /* Retrieve all posts */
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

    /* Record user typed search input */
    const logUserInput = (e) => {
        setCurrentTitleSearched(() => e.target.value)
    }

    /* Record user selection in the search suggestions provided by the search bar */
    const logUserInputSelection = (e) => {
        setCurrentTileSelected(() => e.target.value)
        setCurrentTitleSearched(() => "")
    }

    /* Display all posts on the page without search filters */
    const resetUserInputSelection = (e) => {
        setCurrentTileSelected(() => "")
    }

    return (
        <div id="forum-content-container" data-cy="forum">
            <Header />
            <Title name={"Forum"} />
            <div id="forum-container">
                <div id="forum-side-bar">
                    <NavLink 
                        className="nav-link-forum"
                        to='/forum/canvas'
                        data-cy="nav-to-canvas">View canvas
                    </NavLink>
                    <NavLink 
                        className="nav-link-forum"
                        to='/forum/createpost'
                        data-cy="nav-to-create-post">Create Post
                    </NavLink>
                </div>
                <div id="forum-post-feed">
                    <div id="forum-search-bar-container">
                        <input
                            id={"forum-search-bar"}
                            placeholder={"Search for a post"}
                            value={currentTitleSearched}
                            onChange={logUserInput}
                            data-cy="search-posts"
                        />
                        <button id="refresh-button" onClick={resetUserInputSelection}> 
                            <RefreshIcon /> 
                        </button>
                    </div>
                    <div id="forum-search-results-container">
                        {currentTitleSearched != "" && currentPostTitles.map((title) => {
                            if (title.toLocaleLowerCase().match(currentTitleSearched.toLocaleLowerCase())) {
                                return <button  id={"forum-search-results"} 
                                                value={title} 
                                                onClick={logUserInputSelection}
                                                data-cy="search-results">
                                            <SearchIcon id="forum-search-results-icon" />
                                            {title}
                                        </button>
                            }})
                        }
                    </div>
                    {currentPosts.map((post) => {
                        if (post.title == currentTitleSelected & currentTitleSelected != "") {
                        return <Post 
                            displayName={post['displayName']}
                            title={post['title']}
                            body={post['body']}
                            id={post['id']}
                            comments={post['comments']}
                            uid={post['uid']}
                            postID={post['postID']}
                        />
                        } else if (currentTitleSelected == "" ) {
                            return <Post 
                            displayName={post['displayName']}
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

