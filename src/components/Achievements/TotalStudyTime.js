import React, { useEffect, useState } from "react";
import { db } from "../../firebase.js"
import { UserAuth } from "../../context/AuthContext";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import "./Achievements.css";

const TotalStudyTime = () => {
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
                        count: Number((doc.data()["time"])),
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

    let seconds = ("0" + (Math.floor((totalTimeStudied / 1000) % 60) % 60)).slice(-2);
    let minutes = ("0" + Math.floor((totalTimeStudied / 60000) % 60)).slice(-2);
    /* Need debug hours */
    let hours = ("0" + Math.floor((totalTimeStudied / 3600000) % 60)).slice(-2);

    return (
        <div className="achievements">
            <p className="total-study-time">Total time studied: {hours} hours {minutes} minutes {seconds} seconds</p>
        </div>
    )

}

export default TotalStudyTime