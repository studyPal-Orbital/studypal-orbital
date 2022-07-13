import React from 'react';
import { useState, useEffect } from 'react';
import {db} from "../../firebase.js"
import {
    collection,
    query,
    onSnapshot,
    doc,
    setDoc,
    where,
} from "firebase/firestore"
import { UserAuth } from "../../context/AuthContext.js"

const Popup = (props) => {
    const { user } = UserAuth()
    let timeStudied = props.timeStudied
    const [currentRecords, setCurrentRecords] = useState([])
    let currentDate = new Date().toISOString().split('T')[0].toString()
    let newRecordID = currentDate + '-' + user.uid

    /* Retrieving records of total time studied by user */
    useEffect(() => {
        let active = true 
        if (active = true & user.uid != null) {
            const q = query(collection(db, "time-studied-record"), where("recordID", "==", newRecordID))
            console.log("Retrieving time studied records")
            const getAllRecords = onSnapshot(q, (querySnapshot) => {
                let records = []
                querySnapshot.forEach((doc) => {
                    records.push({...doc.data()})
                })
                setCurrentRecords(() => records)
                console.log(records)
            })
            return () => {active = false}}
    }, [user.uid])

    /* Record total duration of time user has studied */
    const logTimeStudied = async () => {
        props.setTrigger(false)
        let currentRec = currentRecords.filter((rec) => rec['recordID'] == newRecordID)
        let newDate = currentRec.length == 1 ? currentRec[0]['date'] : currentDate
        let newTime = currentRec.length == 1 ? currentRec[0]['time'] + timeStudied : timeStudied
        console.log(newTime)
        let newRecord = {
          uid: user.uid,
          recordID: newRecordID,
          date: newDate,
          time: newTime
        }
        await setDoc(doc(db, "time-studied-record", newRecordID), newRecord)

    }

    return (props.trigger) ? (
        <div id="popup">
            <div id="popup-inner">
                <button id="close-btn" onClick ={logTimeStudied}> Close </button>
                    { props.children }
            </div>
        </div>
    ) : "";
}

export default Popup;


