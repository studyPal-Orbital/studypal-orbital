import { Link, NavLink } from 'react-router-dom'

function Header () {
    return (
        <nav className="nav-bar">
            <p>
                <NavLink 
                className="nav-link"
                to='/home'>Home</NavLink>
            </p>
            <p>
                <NavLink 
                className="nav-link"
                to='/todolist'>To-do List</NavLink>
            </p>
            <p>
                <NavLink 
                className="nav-link"
                to='/calendar'>Calender</NavLink>
            </p>
            <p>
                <NavLink 
                className="nav-link"
                to='/timer'>Timer</NavLink>
            </p>
            <p>
                <NavLink 
                className="nav-link"
                to='/analytics'>Analytics</NavLink>
            </p>
            <p>
                <NavLink 
                className="nav-link"
                to='/achievements'>Achievements</NavLink>
            </p>
            <p>
                <NavLink 
                className="nav-link"
                to='/about'>About</NavLink>
            </p>
        </nav>
    )
}

export default Header;