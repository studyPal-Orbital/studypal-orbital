import './App.css';
import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';

import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Home from './components/Home.jsx'
import LandingPage from './components/LandingPage.jsx'
import Todolist from './components/Todolist.js'
import Calendar from './components/Calendar.js'
import Analytics from './components/Analytics.js'
import Timer from './components/Timer.js'
import Achievements from './components/Achievements.js'
import About from './components/About.js'


function App() {

  return (
    <div className="App">
      {/* Header appears in every page */}
      <Header/>

      <header className="App-header">
        <AuthContextProvider>
          <Routes>
              <Route path='/' element={<LandingPage/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/home' element={<Home/>}/>
              <Route path='/todolist' element={<Todolist/>}/>
              <Route path='/calendar' element={<Calendar/>}/>
              <Route path='/timer' element={<Timer/>}/>
              <Route path='/analytics' element={<Analytics/>}/>
              <Route path='/achievements' element={<Achievements/>}/>
              <Route path='/about' element={<About/>}/>
          </Routes>
        </AuthContextProvider>

      </header>

      {/* Footer appears in every page */}
      <Footer />
    </div>
  );
}

export default App;


