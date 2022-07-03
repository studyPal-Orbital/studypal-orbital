import React, { useState, useRef } from 'react';
import prepop from '../../img/prepop.svg'
import pop from '../../img/popped.svg'

import './BubbleWrap.css'
import Bubble from './Bubble';

import { NavLink } from 'react-router-dom';

const BubbleWrap = () => {

    let arr = [...Array(200).keys()]

    return (
        <div>
            <h1 className="bubble-wrap-header">Bubble Wrap</h1>
            <NavLink
                to='/analytics'
                className="bubble-wrap-back"
            >
                Back
            </NavLink>
            <div className="bubble-wrap-container">
                <div className="bubble-wrap-container">
                    {arr.map((index) => (
                        <Bubble 
                            className="bubbles" 
                            id={index}
                        />
                    ))}
                </div>
            </div>
        </div>
       
    )

}
export default BubbleWrap;