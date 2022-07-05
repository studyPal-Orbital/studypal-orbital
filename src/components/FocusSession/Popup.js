import React from 'react';
import { useState, useEffect } from 'react';

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
    addDoc
  } from "firebase/firestore"
import { UserAuth } from "../../context/AuthContext.js"


function Popup(props) {
    const { user } = UserAuth()
    let timeStudied = props.timeStudied
    const [currentRecords, setCurrentRecords] = useState([])
    let currentDate = new Date().toISOString().split('T')[0].toString()
    let newRecordID = currentDate + '-' + user.uid

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
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick ={logTimeStudied}> CLOSE </button>
                    { props.children }
            </div>
        </div>
    ) : "";
}

export default Popup;


