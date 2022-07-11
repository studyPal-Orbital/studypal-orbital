import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'
import React, { useState, useEffect } from 'react'
import Header from '../Header/Header.js';
import './Home.css'

import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    setDoc,
    deleteDoc,
    where,
    QuerySnapshot,
    addDoc,
    orderBy
  } from "firebase/firestore"


const Home = () => {

    const { user, logout } = UserAuth()
    const navigate = useNavigate()

    const [ calendarRecords, setCalendarRecords ] = useState([])
    const [ upcomingEvent, setUpcomingEvent ] = useState("")
    const [ upcomingEventDate, setUpcomingEventDate ] = useState("")

    let currentHour = new Date().getHours()
    const greeting = currentHour >= 8 && currentHour < 12 ? "Good Morning" : 
                        currentHour >= 12 && currentHour < 18 ? "Good Afternoon" : "Good Evening"

    useEffect(() => {
        let active = true
        if (active == true & user.uid != null) {
            const q = query(collection(db, "calendar"), where ("uid", "==", user.uid), orderBy("start"))
            console.log("Retrieving calendar records")
            const getAllRecords = onSnapshot(q, (querySnapshot) => {
                let records = []
                querySnapshot.forEach((doc) => {
                    records.push({...doc.data()})
                })

                records = records.filter((record) => new Date(record['start']['seconds'] * 1000) >= new Date())
                setCalendarRecords(() => records)

                let dateFormat = new Date(records[0]['start']['seconds'] * 1000).toString().split(' ')
                let date = `${dateFormat[1]} ${dateFormat[2]} ${dateFormat[3]}`
                setUpcomingEvent(() => records[0]['title'])
                setUpcomingEventDate(() => date)
            })
            return () => {active = false}}
    }, [user.uid])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/')
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
         <div className="home-page-container">
            <Header />
            <div className="home-page-img-container">
                {currentHour >= 8 && currentHour <= 18 ? 
                <div className="afternoon"></div> : 
                 <div className="evening"></div>}
            </div>
            <div className="home-page-content-container">
                <h3 className="home-page-title">{greeting} {user.displayName}</h3>
                <p className="home-page-events">Upcoming events: {upcomingEvent} on {upcomingEventDate}</p>
                <button className = 'home-signout' onClick={handleLogout}>Sign out</button>
            </div>
        </div>
    )
}

export default Home;

