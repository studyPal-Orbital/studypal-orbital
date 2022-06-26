import React from 'react'

import { useState, useEffect } from 'react'
import { rangeContainsMarker } from '@fullcalendar/react'


import { db } from "../../firebase"
import { collection, 
         query,
         doc,
         where,
         setDoc, 
         addDoc,
         updateDoc, 
         serverTimestamp,
         onSnapshot } from "firebase/firestore"

import { UserAuth } from '../../context/AuthContext'

import { NavLink } from 'react-router-dom'

import Title from '../Title/Title.js'
import './CollaborativeCanvas.css'

import CanvasTimer from './CanvasTimer'


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

        let newDocUser = {
            uid: user.uid,
            createdTime: moment(new Date()).format('hh:mm A'),
            endTime: moment(new Date()).add(40, 'minutes').format('hh:mm A')
        }
        await setDoc(doc(db, "canvas-users", user.uid), newDocUser)

    }

    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "canvas"))
            console.log("Retrieving canvas colours")
            const getAllComments = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setCanvasColour(() => doc.data()['canvas'])
                })
            })
            return () => {active = false}
        }
    }, [user.uid])

    useEffect(() => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "canvas-users"), where("uid", "==", user.uid))
            console.log("Retrieving user canvas activity")
            const getAllComments = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setEndTime(() => doc.data()['endTime'])
                })
            })
            return () => {active = false}
        }
    }, [user.uid])


    const placeBlockandStartTimer = (e) => {
        let current = moment(new Date()).format('hh:mm A')
        if (endTime == "" || current > endTime) {
            saveCanvas(e)
        } else {
            alert("Come back again at " + endTime + " to place another block")
        }
    }

    return (
        <div>
            <Title name={"Collaborative Canvas"} />
            <p className="canvas-description">Create a collaborative pixel art by placing a block upon completion of your study sessions!
            <br></br><br></br>Come back 40 mins later to place another block</p>
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
                {keys.map((index) => <button className={"cell"} onClick={placeBlockandStartTimer} 
                id={index} style={{backgroundColor: canvasColour[index]}}/>)}
            </div>
        </div>
      
        
    )
}

export default CollaborativeCanvas;

/*
 const [timer, setTimer] = useState(false)

    let [timerClock, setTimerClock] = useState(5000); 

    useEffect((timer) => {
        if (timer == true) {
            const timerClock = setTimeout(() => {
                console.log("minus: ", timerClock)
                setTimerClock(() => timerClock - 1);
            }, 1000)
            return () => { 
            clearTimeout(timerClock)
            }
        }}, [timerClock])

    const registerEv = (e) => {
        saveCanvas(e)
        setTimer(() => true)
        console.log(timer)
    }
    */


    /*

  


          /*
          const getAllComments = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data()['endTime'])
                setEndTime(() => doc.data()['endTime'])
            })
          })
          return () => {active = false}
    }, [user.uid])*/

    /*
    const placeBlockandStartTimer = (e) => {
        let current = moment(new Date()).format('hh:mm A')
        if (endTime == "" || current > endTime) {
            let end = moment(new Date()).add(1, 'minutes').format('hh:mm A')
            setEndTime(() => end)
            saveCanvas(e)
        } else {
            alert("Come back again after 30 mins is up to place another block")
        }

    }*/


            