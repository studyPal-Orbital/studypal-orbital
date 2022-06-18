import { NavLink } from 'react-router-dom'
import React from 'react'

import './Header.css'

function Header () {
    return (
        <nav className="nav-bar">
            <h3>
                <NavLink 
                className="nav-link"
                to='/home'>Home</NavLink>
            </h3>
            <h3>
                <NavLink 
                className="nav-link"
                to='/todolist'>Task tracker</NavLink>
            </h3>
            <h3>
                <NavLink 
                className="nav-link"
                to='/timer'>Focus Session</NavLink>
            </h3>
            <h3>
                <NavLink 
                className="nav-link"
                to='/analytics'>Analytics</NavLink>
            </h3>
            <h3>
                <NavLink 
                className="nav-link"
                to='/achievements'>Achievements</NavLink>
            </h3>
        </nav>
    )
}

export default Header;