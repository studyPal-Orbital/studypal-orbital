import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';

import './index.css';
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Home from './components/Home/Home.jsx'
import LandingPage from './components/LandingPage/LandingPage.jsx'
import Todolist from './components/TaskTracker/Todolist.js'
import Analytics from './components/Analytics/Analytics.js'
import Timer from './components/FocusSession/Timer.js'
import Achievements from './components/Forum/Achievements.js'
import CollaborativeCanvas from './components/Forum/CollaborativeCanvas.js'
import CreatePost from './components/Forum/CreatePost';
import Comments from  './components/Forum/Comments';
import CreateComment from './components/Forum/CreateComment';
import NotFoundPage from './NotFoundPage.js'

import React from 'react'
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
                <Route path='/todolist' element={<Todolist/>}/>
                <Route path='/timer' element={<Timer/>}/>
                <Route path='/analytics' element={<Analytics/>}/>
                <Route path='/achievements' element={<Achievements/>}/>
                <Route path='/achievements/canvas' element={<CollaborativeCanvas/>}/>
                <Route path='/achievements/createpost' element={<CreatePost/>}/>
                <Route path='/achievements/comments' element={<Comments/>}/>
                <Route path='/achievements/createcomment' element={<CreateComment/>}/>
                <Route path='*' element={<NotFoundPage/>}/>
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>

      </header>
      {/* Footer appears in every page */}
    </div>
  );
}

export default App;


