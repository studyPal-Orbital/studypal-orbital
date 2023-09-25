import { Route, Routes, HashRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';

import './index.css';
import Login from './components/LoginSignup/Login.js'
import Signup from './components/LoginSignup/Signup.js'
import Home from './components/Home/Home.js'
import LandingPage from './components/LandingPage/LandingPage.jsx'
import FocusSession from './components/FocusSession/FocusSession.js'
import Analytics from './components/Analytics/Analytics.js'
import BubbleWrap from './components/Analytics/BubbleWrap/BubbleWrap.js'
import Achievements from './components/Achievements/Achievements.js'
import Forum from './components/Forum/Forum.js'
import CollaborativeCanvas from './components/Forum/CollaborativeCanvas.js'
import CreatePost from './components/Forum/CreatePost.js';
import Comments from  './components/Forum/Comments.js';
import CreateComment from './components/Forum/CreateComment.js';
import NotFoundPage from './NotFoundPage.js'
import React from 'react';
import JournalEntry from './components/Analytics/JournalEntry';
import ActiveJournalSubmission from './components/Analytics/ActiveJournalSubmission';
import ArchiveJournalSubmission from './components/Analytics/ArchiveJournalSubmission';
import AllArchiveJournalEntries from './components/Analytics/AllArchiveJournalEntries';
import AllActiveJournalEntries from './components/Analytics/AllActiveJournalEntries';

import Todolist from './components/TaskTracker/Todolist';
import Edittodo from './components/TaskTracker/Edittodo';
import CalendarGrid from './components/TaskTracker/CalendarGrid';
import Abouttodo from './components/TaskTracker/Abouttodo';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <AuthContextProvider>
          <HashRouter>
            <Routes>
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/bubbles' element={<BubbleWrap/>}/>
                <Route path='/focus-session' element={<FocusSession/>}/>
                <Route path='/achievements' element={<Achievements/>}/>
                <Route path='/forum' element={<Forum/>}/>
                <Route path='/forum/canvas' element={<CollaborativeCanvas/>}/>
                <Route path='/forum/createpost' element={<CreatePost/>}/>
                <Route path='/forum/comments' element={<Comments/>}/>
                <Route path='/forum/createcomment' element={<CreateComment/>}/>
                <Route path='/analytics' element={<Analytics/>}/>
                <Route path='/journal' element={<JournalEntry/>}/>
                <Route path='/thoughts-kept' element={<ActiveJournalSubmission/>}/>
                <Route path='/thoughts-let-go' element={<ArchiveJournalSubmission/>}/>
                <Route path='/archived-thoughts' element={<AllArchiveJournalEntries/>}/>
                <Route path='/active-thoughts' element={<AllActiveJournalEntries/>}/>
                <Route path='/task-tracker' element={<Todolist/>}/>
                <Route path='/edit-todo' element={<Edittodo/>}/>
                <Route path='/calendar' element={<CalendarGrid/>}/>
                <Route path='/about-todo' element={<Abouttodo/>}/>
                <Route path='*' element={<NotFoundPage/>}/>
            </Routes>
          </HashRouter>
        </AuthContextProvider>
      </header>
    </div>
  );
}

export default App;


