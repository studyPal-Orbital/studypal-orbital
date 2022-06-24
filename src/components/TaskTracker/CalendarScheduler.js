import React from 'react'
import { useEffect, useState } from 'react'

import { db } from "../../firebase"
import {  doc, 
          addDoc, 
          collection, 
          query, 
          onSnapshot,
          deleteDoc,
          where,
          setDoc
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

  const normalizeDateTimeField = (events) => {
    for (let i = 0; i < events.length; i++) {
      let title = events[i]['title']
      let id = events[i]['id']
      let docID = events[i]['docID']
      let start = new Date(events[i]['start']['seconds'] * 1000)
      let end = new Date(events[i]['end']['seconds'] * 1000)
  
      let newEvent = {
        title: title,
        start: start,
        end: end,
        uid: user.uid,
        docId: docID
      }
      events[i] = newEvent
    }
    return events
  }

  useEffect((e) => {
    let active = true
    if (active == true && user.uid != null) {
      const q = query(collection(db, "calendar"), where ("uid", "==", user.uid))
      console.log("Retrieving events")
      const getAllTasks = onSnapshot(q, (querySnapshot) => {
      let currentEvents = []
      querySnapshot.forEach((doc) => {
        currentEvents.push({ ...doc.data()})
      })
      setEvent(() => normalizeDateTimeField(currentEvents))
      console.log(currentEvents)

    })
    return () => {active = false}}
  },[user.uid])

 
  const createNewEvent = async (e) => {
    const docRef = doc(collection(db, "calendar"));
    let confirmEventTitle = window.prompt("Create a new event")
    if (confirmEventTitle) {
      let newEvent = {
        docID: docRef.id,
        start : e.start,
        end: e.end,
        title: confirmEventTitle,
        uid : user.uid
      }
      let newEvents = [...events, newEvent]
      setEvent(() => newEvents)
      await setDoc(doc(db, "calendar", docRef.id), newEvent)
    }
  }

  const deleteCurrentEvent = async (e) => {
    let confirmDeleteEvent = window.confirm("Delete this event?")
    if (confirmDeleteEvent) {
      console.log(e)
      await deleteDoc(doc(db, "calendar", e.docId))
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
