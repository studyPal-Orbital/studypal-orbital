import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'
import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    where,
    orderBy
} from "firebase/firestore"
import Header from '../Header/Header.js';
import './Home.css'
  
const Home = () => {

    const { user, logout } = UserAuth()
    const navigate = useNavigate()

    const [ calendarRecords, setCalendarRecords ] = useState([])
    const [ upcomingEvent, setUpcomingEvent ] = useState("")
    const [ upcomingEventDate, setUpcomingEventDate ] = useState("")

    // Customise greeting to user based on time of the day
    let currentHour = new Date().getHours()
    const greeting = currentHour >= 8 && currentHour < 12 ? "Good Morning" : 
                        currentHour >= 12 && currentHour < 18 ? "Good Afternoon" : "Good Evening"
    
    // Fetch calendar events to display notifications for upcoming events (if any) 
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

                if (records.length != 0) {
                    let dateFormat = new Date(records[0]['start']['seconds'] * 1000).toString().split(' ')
                    let date = `${dateFormat[1]} ${dateFormat[2]} ${dateFormat[3]}`
                    setUpcomingEvent(() => records[0]['title'])
                    setUpcomingEventDate(() => date)
                } else {
                    setUpcomingEvent(() => 'No upcoming events')
                }     
            })
            return () => {active = false}}
    }, [user.uid])

    // Log out current user
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
         <div id="home-page-container">
            <Header />
            <div id="home-page-img-container">
                {currentHour >= 8 && currentHour <= 18 ? 
                <div id="afternoon"></div> : 
                 <div id="evening"></div>}
            </div>
            <div id="home-page-content-container">
                <h3 id="home-page-title">{greeting} {user.displayName}</h3>
                {upcomingEventDate == "" ? 
                    <p className="home-page-events">Upcoming events: {upcomingEvent}</p> : 
                    <p className="home-page-events">Upcoming events: {upcomingEvent} on {upcomingEventDate}</p>
                }
                <button id="home-page-signout" onClick={handleLogout}>Sign out</button>
            </div>
        </div>
    )
}

export default Home;

