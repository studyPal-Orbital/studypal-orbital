import React from 'react'
import Title from '../Title/Title.js'
import Header from '../Header/Header.js'
import './ActivityHeatmap.css'

import { useState, useEffect } from 'react'
import { rangeContainsMarker } from '@fullcalendar/react'

const ActivityHeatmap = () => {

    const [colour, setColour] = useState("cell")

    const handleClick = (e) => {
        let elem = document.getElementById(e.target.id)
        
        if (elem.style.backgroundColor != "orange") {
            elem.style.backgroundColor = "orange"
        } else {
            elem.style.backgroundColor = "#ddd"
        }

        setColour(() => elem.style.backgroundColor)
    }



    let arr = [...Array(365).keys()]
    
    return (
        <div class="squaregrid">
            {arr.map((item) => <button className={"cell"} onClick={handleClick} id={item} />)}
        </div>
    )
}

export default ActivityHeatmap;
