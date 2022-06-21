import React from 'react'
import Title from '../Title/Title.js'
import Header from '../Header/Header.js'
import './ActivityHeatmap.css'

import { useState, useEffect } from 'react'
import { rangeContainsMarker } from '@fullcalendar/react'



const ActivityHeatmap = () => {
    let keys = [...Array(365).keys()]
    let values = Array(365).fill("#ddd")
    let arr = {}
    keys.forEach((key) => arr[key] = values[key])

    const [colour, setColour] = useState(arr)

    const handleClick = (e) => {
        let elemId = e.target.id
        let elem = document.getElementById(elemId)
        
        if (elem.style.backgroundColor != "orange") {
            elem.style.backgroundColor = "orange"
        } else {
            elem.style.backgroundColor = "#ddd"
        }

        colour[elemId] = elem.style.backgroundColor
        setColour(() => colour)
        console.log(colour)
    }

    return (
        <div class="squaregrid">
            {keys.map((index) => <button className={"cell"} onClick={handleClick} 
            id={index} style={{backgroundColor: colour[index]}}/>)}
        </div>
    )
}

export default ActivityHeatmap;



            