import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';

import './index.css';
import Login from './components/LoginSignup/Login.jsx'
import Signup from './components/LoginSignup/Signup.jsx'
import Home from './components/Home/Home.jsx'
import LandingPage from './components/LandingPage/LandingPage.jsx'
import TaskTracker from './components/TaskTracker/TaskTracker'
import FocusSession from './components/FocusSession/FocusSession.js'
import Achievements from './components/Achievements/Achievements.js'
import Forum from './components/Forum/Forum.js'
import CollaborativeCanvas from './components/Forum/CollaborativeCanvas.js'
import CreatePost from './components/Forum/CreatePost.js';
import Comments from  './components/Forum/Comments.js';
import CreateComment from './components/Forum/CreateComment.js';
import NotFoundPage from './NotFoundPage.js'

import React from 'react';
import { BrowserRouter } from "react-router-dom";


function App() {

  return (
    <div className="App">

      <header className="App-header">
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/task-tracker' element={<TaskTracker/>}/>
                <Route path='/focus-session' element={<FocusSession/>}/>
                <Route path='/achievements' element={<Achievements/>}/>
                <Route path='/forum' element={<Forum/>}/>
                <Route path='/forum/canvas' element={<CollaborativeCanvas/>}/>
                <Route path='/forum/createpost' element={<CreatePost/>}/>
                <Route path='/forum/comments' element={<Comments/>}/>
                <Route path='/forum/createcomment' element={<CreateComment/>}/>
                <Route path='*' element={<NotFoundPage/>}/>
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>

      </header>
    </div>
  );
}

export default App;


