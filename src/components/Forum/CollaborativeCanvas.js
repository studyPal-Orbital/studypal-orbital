import React from 'react'
import { useState, useEffect } from 'react'
import { db } from "../../firebase"
import { collection, 
         query,
         doc,
         where,
         setDoc, 
         serverTimestamp,
         onSnapshot } from "firebase/firestore"
import { UserAuth } from '../../context/AuthContext'
import { NavLink } from 'react-router-dom'
import Title from '../Title/Title.js'
import './CollaborativeCanvas.css'
import moment from 'moment'

const CollaborativeCanvas = () => {
    const {user}  = UserAuth()

    let keys = [...Array(2500).keys()]
    let values = Array(2500).fill("white")
    let arr = {}
    keys.forEach((key) => arr[key] = values[key])

    const [currentColour, setCurrentColour] = useState("black")
    const [canvasColour, setCanvasColour] = useState(arr)
    const [endTime, setEndTime] = useState("")

    /* Retrieve current state of canvas */
    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "canvas"))
            console.log("Retrieving canvas colours")
            const getCanvas = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setCanvasColour(() => doc.data()['canvas'])
                })
            })
            return () => {active = false}
        }
    }, [user.uid])

    /* Retrieve next timestamp that user can place a canvas block */
    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "canvas-users"), where("uid", "==", user.uid))
            console.log("Retrieving user canvas activity")
            const getUserEndTime = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setEndTime(() => doc.data()['endTime'])
                })
            })
            return () => {active = false}
        }
    }, [user.uid])

    /* Change canvas block colour */
    const toggleColour = (e) => {
        setCurrentColour(() => e.target.value)
    }

    /* Save user action on the canvas */
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

        let newDocUser = {
            uid: user.uid,
            createdTime: moment(new Date()).format('hh:mm A'),
            endTime: moment(new Date()).add(40, 'minutes').format('hh:mm A')
        }
        await setDoc(doc(db, "canvas-users", user.uid), newDocUser)

    }

    /* Record user placing a block & start the 40 min cooldown period */
    const placeBlockandStartTimer = (e) => {
        let current = moment(new Date()).format('hh:mm A')
        if (endTime == "" || current > endTime) {
            saveCanvas(e)
            console.log(current > endTime)
        } else {
            alert("Come back again at " + endTime + " to place another block")
        }
    }

    return (
        <div id="collab-canvas-container">
            <Title name={"Collaborative Canvas"} />
            <p id="canvas-description">Place a block upon completion of your study sessions and create a pixel art together with other users!
            <br></br><br></br>Come back 40 mins later at {endTime} to place another block</p>
            <div id="colour-picker-container">
                <NavLink 
                    id="nav-link-canvas"
                    to='/forum'>Back
                </NavLink>
                <p id="colour-picker-caption">Colour Picker: </p>
                <input
                    id="colour-picker"
                    type='color'
                    onChange={toggleColour}
                />
            </div>
            <div id="squaregrid">
                {keys.map((index) => <button className={"cell"} onClick={placeBlockandStartTimer} 
                id={index} style={{backgroundColor: canvasColour[index]}}/>)}
            </div>
        </div>
      
        
    )
}

export default CollaborativeCanvas      