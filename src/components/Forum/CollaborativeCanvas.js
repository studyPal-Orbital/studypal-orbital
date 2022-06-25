import React from 'react'

import { useState, useEffect } from 'react'
import { rangeContainsMarker } from '@fullcalendar/react'


import { db } from "../../firebase"
import { collection, 
         query,
         doc,
         setDoc, 
         addDoc,
         updateDoc, 
         serverTimestamp,
         onSnapshot } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'

import { NavLink } from 'react-router-dom'

import Title from '../Title/Title.js'
import './CollaborativeCanvas.css'

const CollaborativeCanvas = () => {
    const {user}  = UserAuth()

    let keys = [...Array(2500).keys()]
    let values = Array(2500).fill("white")
    let arr = {}
    keys.forEach((key) => arr[key] = values[key])

    

    const [currentColour, setCurrentColour] = useState("black")
    const [canvasColour, setCanvasColour] = useState(arr)

    const toggleColour = (e) => {
        setCurrentColour(() => e.target.value)
    }

    const saveCanvas = async (e) => {
        let elemId = e.target.id
        let elem = document.getElementById(elemId)
        elem.style.backgroundColor = currentColour
        canvasColour[elemId] = elem.style.backgroundColor
        setCanvasColour(() => canvasColour)
    
        const docRef = doc(collection(db, "canvas"),"main-canvas")
        let newDoc = {
            createdAt: serverTimestamp(),
            canvas: canvasColour
        }
        await setDoc(doc(db, "canvas", "main-canvas"), newDoc) 
    }

    useEffect(() => {
        let active = true
          const q = query(collection(db, "canvas"))
          console.log("Retrieving comments list")
          const getAllComments = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data()['canvas'])
                setCanvasColour(() => doc.data()['canvas'])
            })
          })
          return () => {active = false}
    }, [user.uid])


    return (
        <div>
            <Title name={"Collaborative Canvas"} />
            <p className="canvas-description">Create a collaborative pixel art by placing a block upon completion of each 1 hour study session!
            <br></br><br></br>Come back 1 hour again to place another block</p>
            <div className="colour-picker-container">
                <NavLink 
                    className="nav-link-canvas"
                    to='/forum'>Back
                </NavLink>
                <p className="colour-picker-caption">Colour Picker: </p>
                <input
                    className="colour-picker"
                    type='color'
                    onChange={toggleColour}
                />
            </div>
            <div class="squaregrid">
                {keys.map((index) => <button className={"cell"} onClick={saveCanvas} 
                id={index} style={{backgroundColor: canvasColour[index]}}/>)}
            </div>
        </div>
      
        
    )
}

export default CollaborativeCanvas;



            