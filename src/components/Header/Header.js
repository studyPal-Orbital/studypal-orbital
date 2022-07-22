import { NavLink } from 'react-router-dom'
import React from 'react'

import './Header.css'

function Header () {
    return (
        <nav className="nav-bar">
            <h3>
                <NavLink 
                id="home-header"
                className="nav-link"
                to='/home'>Home</NavLink>
            </h3>
            <h3>
                <NavLink 
                className="nav-link"
                data-cy="task-tracker-header"
                to='/task-tracker'>Task Tracker</NavLink>
            </h3>
            <h3>
                <NavLink 
                id="focus-session-header"
                className="nav-link"
                data-cy="focus-session-header"
                to='/focus-session'>Focus Session</NavLink>
            </h3>
            <h3>
                <NavLink 
                id="forum-header"
                className="nav-link"
                data-cy="forum-header"
                to='/forum'>Forum</NavLink>
            </h3>
            <h3>
                <NavLink 
                id="profile-header"
                className="nav-link"
                data-cy="profile-header"
                to='/analytics'>Profile</NavLink>
            </h3>
        </nav>
    )
}

export default Header;