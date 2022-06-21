import React from 'react'
import './ActivityHeatmap.css'

import { useState, useEffect } from 'react'
import { rangeContainsMarker } from '@fullcalendar/react'


import { db } from "../../firebase"
import { collection, 
         doc,
         setDoc, 
         addDoc,
         updateDoc, 
         serverTimestamp } from "firebase/firestore"


import { TextField } from '@mui/material';

import { UserAuth } from '../../context/AuthContext'


const ActivityHeatmap = () => {
    const {user}  = UserAuth()

    let keys = [...Array(365).keys()]
    let values = Array(365).fill("#ddd")
    let arr = {}
    keys.forEach((key) => arr[key] = values[key])

    const [colour, setColour] = useState(arr)

    const handleClick = async (e) => {
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

        await setDoc(doc(db, "heatmap", user.uid), {
            colours : colour,
            uid: user.uid
        })
    }

    return (
        <div class="squaregrid">
            {keys.map((index) => <button className={"cell"} onClick={handleClick} 
            id={index} style={{backgroundColor: colour[index]}}/>)}
        </div>
    )
}

export default ActivityHeatmap;



            