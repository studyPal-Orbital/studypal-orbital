import React from "react";
import { NavLink } from "react-router-dom";
import Header from '../Header/Header.js'
import Title from '../Title/Title.js'
import active from '../img/active.png'
import archive from '../img/archive.png'
import dp from '../img/dp.jpg'

import CalendarHeatmap from "react-calendar-heatmap";
import { UserAuth } from '../../context/AuthContext'

import EditIcon from "@mui/icons-material/Edit"

const Analytics = () => {

    const {user}  = UserAuth()

    return (
        <div>
            <Header />
            <Title name={"Profile"} />
            <div className="achievements-container">
                <div className="side-col">
                    <h3>Account details</h3>
                    <img className="profile-pic" src={dp}></img>
                    <p>Email: {user.email}</p>
                    <NavLink className='side-col-ext-links' to='/achievements'>
                            View Badges Collected
                    </NavLink>
                    <div className="side-col-links-container">
                        <h3>Mood Journals</h3>
                        <NavLink className='side-col-links' to='/journal'>
                            <EditIcon/>
                        </NavLink>
      
                    </div>
                    <div className='side-col-books'>
                        <NavLink className='side-col-img-links' to='/archived-thoughts'>
                            <img className='side-col-img' src={archive}></img>
                        </NavLink>
                        <NavLink className='side-col-img-links' to='/active-thoughts'>
                            <img className='side-col-img' src={active}></img>
                        </NavLink>
                    </div>
                    <div className="side-col-links-container">
                        <NavLink className='side-col-ext-links' to='/bubbles'>
                            Pop some bubbles!
                        </NavLink>
                    </div>
                </div>
                <div className="analytics-container">
                    <h3>Focus Hours</h3>
                    <CalendarHeatmap
                        className="activity-calendar"
                        startDate={new Date('2021-12-31')}
                        endDate={new Date('2022-12-31')}
                        values={[
                            { date: '2016-01-01', count: 12 },
                            { date: '2016-01-22', count: 122 },
                            { date: '2016-01-30', count: 38 },
                        ]}
                    />
                    <div className="goal-setting-section">
                        <h3 className="achievements-title">Task Completion</h3>
                        <CalendarHeatmap
                            className="activity-calendar"
                            startDate={new Date('2021-12-31')}
                            endDate={new Date('2022-12-31')}
                            values={[
                                { date: '2016-01-01', count: 12 },
                                { date: '2016-01-22', count: 122 },
                                { date: '2016-01-30', count: 38 },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics