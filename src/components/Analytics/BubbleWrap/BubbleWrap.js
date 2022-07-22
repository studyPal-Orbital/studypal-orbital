import React from 'react';
import './BubbleWrap.css'
import Bubble from './Bubble';
import { NavLink } from 'react-router-dom';

const BubbleWrap = () => {

    /* Generate bubbles for user to pop */
    let arr = [...Array(200).keys()]

    return (
        <div id="bubble-wrap" data-cy="bubble-wrap">
            <h1 id="bubble-wrap-header">Bubble Wrap</h1>
            <NavLink
                to='/analytics'
                id="bubble-wrap-nav-link"
                data-cy="nav-bubble-to-forum"
            >
                Back
            </NavLink>
            <div id="bubble-wrap-container">
                {arr.map((index) => (
                    <Bubble 
                        id={index}
                    />
                ))}
            </div>
        </div>  
    )
}
export default BubbleWrap;