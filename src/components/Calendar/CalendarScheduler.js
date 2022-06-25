import React from 'react'
import { useEffect, useState } from 'react'

import { db } from "../../firebase"
import {  doc, 
          addDoc, 
          collection, 
          query, 
          onSnapshot,
          deleteDoc
        } from "firebase/firestore"; 


import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Title from '../Title.js'

import './CalendarScheduler.css'


const localizer = momentLocalizer(moment);

const CalendarScheduler = (props) => {

  const[events, setEvent] = useState([])

  const normalizeDateTimeField = (events) => {
    for (let i = 0; i < events.length; i++) {
      let title = events[i]['title']
      let id = events[i]['id']
      let start = new Date(events[i]['start']['seconds'] * 1000)
      let end = new Date(events[i]['end']['seconds'] * 1000)

      let newEvent = {
        title: title,
        id: id,
        start: start,
        end: end
      }
      events[i] = newEvent
    }
    return events
  }
  
  useEffect((e) => {
    let active = true
    if (active == true) {
      const q = query(collection(db, "calendar"))
      const getAllTasks = onSnapshot(q, (querySnapshot) => {
      let currentEvents = []
      querySnapshot.forEach((doc) => {
        currentEvents.push({ ...doc.data(), id: doc.id})
      })
      setEvent(() => normalizeDateTimeField(currentEvents))

    })}
    return () => {active = false}
  },[])

  const createNewEvent = async (e) => {
    let confirmEventTitle = window.prompt("Create a new event")
    if (confirmEventTitle) {
      let newEvent = {
        start : e.start,
        end: e.end,
        title: confirmEventTitle
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
      <Title name={'Calendar'} />
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
