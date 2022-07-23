import React, { useEffect, useState } from "react";
import { db } from "../../../firebase.js";
import { UserAuth } from "../../../context/AuthContext";
import { collection, query, onSnapshot, where } from "firebase/firestore";

function TwoThousandHours() {
    const { user } = UserAuth();
    const [timeStudied, setTimeStudied] = useState([]);
    const [totalTimeStudied, setTotalTimeStudied] = useState(0);
    
    /* Calculate total study time in focus session by user */
    const calculateTotalTimeStudied = (sessions) => {
        let counter = 0;
        sessions.forEach((task) => {
            counter += task.count;
        });
        setTotalTimeStudied(() => counter);
    };
    
    /* Retrieve user study time */
    useEffect(() => {
        let active = true;
        if ((active === true) & (user.uid !== null)) {
            const q = query(
                collection(db, "time-studied-record"),
                where("uid", "==", user.uid)
            );
            console.log("Retrieving user time studied records");
            onSnapshot(q, (querySnapshot) => {
                let timeStudiedRecords = [];
                querySnapshot.forEach((doc) => {
                    let record = {
                        date: doc.data()["date"],
                        count: Number((doc.data()["time"] / 3600000).toFixed(3)),
                    };
                    timeStudiedRecords.push(record);
                    console.log(timeStudiedRecords);
                });
                setTimeStudied(() => timeStudiedRecords);
                calculateTotalTimeStudied(timeStudiedRecords);
            });
            return () => {
                active = false;
            };
        }
    }, [user.uid]);

    const TwoThousandHoursAccomplished = () => {
        return (
            <>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css" crossorigin="anonymous"></link>
            <h4>2000 hours</h4>
            <i class="fa-solid fa-trophy fa-2x two-thousand-hours-done"></i>
            <p>Accomplished</p>
            </>
        )
    }

    const TwoThousandHoursLocked = () => {
        return (
            <>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css" crossorigin="anonymous"></link>
            <h4>2000 hours</h4>
            <i class="fa-solid fa-trophy fa-2x two-thousand-hours-locked"></i>
            <p><i class="fa-solid fa-lock"></i> Locked</p>
            </>
        )
    }

    if (totalTimeStudied < 2000) {
        return <TwoThousandHoursLocked />
    } else {
        return <TwoThousandHoursAccomplished />
    }
}

export default TwoThousandHours;