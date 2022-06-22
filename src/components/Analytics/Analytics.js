import React, { PureComponent } from 'react';

import Header from '../Header/Header.js'
import Title from '../Title/Title.js'
import ActivityHeatmap from './ActivityHeatmap.js'

import './Analytics.css'

import { LineChart, Line, BarChart, CartesianGrid,
XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

/* Tentative */

const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300
  }
]

function Analytics () {
    return (
        <div class='analytics'>
            <Header />
            <Title name={'Analytics'}/>
            <div className="title-container">
                <p className="title-text">A quick glance at your progress!</p>
                <p className="title-text">100 tasks completed</p>
                <p className="title-text">80 hours of focus session</p>
            </div>
            <div className="activity-heat-map">
                <ActivityHeatmap />
                <p className="activity-heat-map-text">Activity heatmap for the year!</p>
            </div>
            <div className="bar-container">
                <BarChart className={"bar"} width={800} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
                <p className="bar-text">Number of tasks completed this week</p>
            </div>
            <div className="bar-container">
                <p className="line-text">Number of hours of focus session this week</p>
                <BarChart className={"line"} width={800} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
            </div>
        </div>
    )
}

export default Analytics;