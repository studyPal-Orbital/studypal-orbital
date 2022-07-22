import React from 'react';
import './BubbleWrap.css'
import Bubble from './Bubble';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const BubbleWrap = () => {

    /* Generate bubbles for user to pop */
    let arr = [...Array(200).keys()]

    const[inflateBubbles, setInflateBubbles] = useState(false)

    const inflateAllBubbles = () => {
        setInflateBubbles(() => !inflateBubbles)
    }

    return (
        <div id="bubble-wrap" data-cy="bubble-wrap">
            <h1 id="bubble-wrap-header">Bubble Wrap</h1>
            <p id="bubble-wrap-caption">Destress by popping some bubbles!</p>
            <NavLink
                to='/analytics'
                id="bubble-wrap-nav-link"
                data-cy="nav-bubble-to-forum"
            >
                Back
            </NavLink>
            <button id="reset-bubbles" onClick={inflateAllBubbles}>Reset</button>
            <div id="bubble-wrap-container">
                {!inflateBubbles && arr.map((index) => (
                    <Bubble 
                        id={index}
                        inflate={inflateBubbles}
                    />
                ))}
                {inflateBubbles && arr.map((index) => (
                    <Bubble 
                        id={index}
                        inflate={inflateBubbles}
                    />
                ))}
            </div>
        </div>  
    )
}
export default BubbleWrap;