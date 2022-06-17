import React from 'react'

import Title from '../Title.js'

import { db } from "../../firebase"

import { async } from "@firebase/util"
import { doc, setDoc, addDoc, collection, query, where, getDocs, onSnapshot  } from "firebase/firestore"; 
import { useEffect, useState } from 'react'

import {
    deleteDoc,
  } from "firebase/firestore"


import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import './Cal.css'

import FullCalendar from "@fullcalendar/react";

import DatePicker from 'react-datepicker';

import  { Navigate } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const events = [
      { start:  new Date(2022, 5, 14), 
        end:  new Date(2022, 5, 21), 
        title: "special event" },
      { start:  new Date(2022, 5, 4), 
        end:  new Date(2022, 5, 4), 
        title: "special event" },
      { start:  new Date(2022, 5, 6), 
        end:  new Date(2022, 5, 8), 
        title: "special event" }
];


const Cal = () => {
  return (
      <div className="App">
        <Title name={"Calendar"}/>
        <Calendar
          defaultDate={moment().toDate()}
          defaultView="month"
          views={['month']}
          events={events}
          localizer={localizer}
          resizable
          style={{ height: "100vh" }}
        />      
      </div>
    );
}



export default Cal
