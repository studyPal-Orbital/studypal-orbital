import React from 'react'
import { useEffect, useState } from 'react'

import { db } from "../../firebase"
import {  doc, 
          addDoc, 
          collection, 
          query, 
          onSnapshot,
          deleteDoc,
          where
        } from "firebase/firestore"; 

import { UserAuth } from '../../context/AuthContext'

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Title from '../Title/Title.js'

import './CalendarScheduler.css'


const localizer = momentLocalizer(moment);


const CalendarScheduler = (props) => {
  
  const {user}  = UserAuth()

  const[events, setEvent] = useState([])

  useEffect((e) => {

    let active = true
    if (active == true && user.uid != null) {
      const q = query(collection(db, "calendar"), where ("uid", "==", user.uid))
      console.log("Retrieving events")
      const getAllTasks = onSnapshot(q, (querySnapshot) => {
      let currentEvents = []
      querySnapshot.forEach((doc) => {
        currentEvents.push({ ...doc.data(), id: doc.id})
      })
      setEvent(() => normalizeDateTimeField(currentEvents))

    })
    return () => {active = false}}
  },[])

  const normalizeDateTimeField = (events) => {
    //const { user } = UserAuth()
    for (let i = 0; i < events.length; i++) {
      let title = events[i]['title']
      let id = events[i]['id']
      let start = new Date(events[i]['start']['seconds'] * 1000)
      let end = new Date(events[i]['end']['seconds'] * 1000)
  
      let newEvent = {
        title: title,
        start: start,
        end: end,
        uid: user.uid
      }
      events[i] = newEvent
    }
    return events
  }

  const createNewEvent = async (e) => {
    //const { user } = UserAuth()
    let confirmEventTitle = window.prompt("Create a new event")
    if (confirmEventTitle) {
      let newEvent = {
        start : e.start,
        end: e.end,
        title: confirmEventTitle,
        uid : user.uid
      }
      let newEvents = [...events, newEvent]
      setEvent(() => newEvents)
      await addDoc(collection(db, "calendar"), newEvent)
    }
  }

  const deleteCurrentEvent = async (e) => {
    let confirmDeleteEvent = window.confirm("Delete this event?")
    if (confirmDeleteEvent) {
      let newEvents = events.filter((event) => event.id != e.id)
      setEvent(() => newEvents)
      await deleteDoc(doc(db, "calendar", e.id))
    }
  }

  return (
      <div className="App"> 
      <Calendar
        defaultDate={moment().toDate()}
        defaultView="month"
        views={['month','week']}
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={createNewEvent}
        onSelectEvent={deleteCurrentEvent}
      />   
      </div>
    );
}

export default CalendarScheduler
