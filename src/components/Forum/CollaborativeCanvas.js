import React from 'react'

import { useState, useEffect } from 'react'
import { rangeContainsMarker } from '@fullcalendar/react'


import { db } from "../../firebase"
import { collection, 
         doc,
         setDoc, 
         addDoc,
         updateDoc, 
         serverTimestamp } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'

import { NavLink } from 'react-router-dom'

import Title from '../Title/Title.js'
import './CollaborativeCanvas.css'


const CollaborativeCanvas = () => {
    const {user}  = UserAuth()

    let keys = [...Array(2500).keys()]
    let values = Array(2500).fill("#ddd")
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
        <div>
            <Title name={"Collaborative Canvas"} />
            <p className="canvas-description">Create a collaborative pixel art by placing a block upon completion of each 1 hour study session!
            <br></br><br></br>Come back 1 hour again to place another block</p>
            <NavLink 
                className="nav-link-canvas"
                to='/achievements'>Back
            </NavLink>
            <div class="squaregrid">
                {keys.map((index) => <button className={"cell"} onClick={handleClick} 
                id={index} style={{backgroundColor: colour[index]}}/>)}
            </div>
        </div>
      
        
    )
}

export default CollaborativeCanvas;



            