import React from 'react'

import music from "../music/lofi_1.mp3";
import rain from "../music/rain.mp3";

import lowfi from "../gif/night.gif";

import Title from '../Title/Title.js'
import Header from '../Header/Header.js'


function Analytics () {
    return (
        <div class='analytics'>
            <Header />
            <Title name={'Analytics'}/>
        </div> 
    )
}

export default Analytics;

