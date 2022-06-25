import { NavLink } from 'react-router-dom'
import React from 'react'

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
                to='/todolist'>To-do List</NavLink>
            </h3>
            <h3>
                <NavLink 
                className="nav-link"
                to='/calendar'>Calender</NavLink>
            </h3>
            <h3>
                <NavLink 
                className="nav-link"
                to='/timer'>Timer</NavLink>
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
            <h3>
                <NavLink 
                className="nav-link"
                to='/about'>About</NavLink>
            </h3>
        </nav>
    )
}

export default Header;