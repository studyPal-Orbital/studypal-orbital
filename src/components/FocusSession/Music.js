import React from 'react'
import { useState } from 'react'

import lowfi from "../gif/lowfi.gif";
import night from "../gif/night.gif";
import sunset from "../gif/sunset.gif";
import train from "../gif/train.gif";
import cat from "../gif/cat.gif";

const lowfimusic = "https://audio.jukehost.co.uk/3t3bRPwoAMTn007BfpFcW4wjwh3pfhQk"

const Music = () => {

    const gif = [lowfi, night, sunset, train, cat]
    let [gifState, setGifState] = useState(0)
    let showNextGif = () => {
        if (gifState < gif.length-1) {
            setGifState(() => gifState + 1)
        } else {
            setGifState(() => 0)
        }
    }

    const music = [lowfimusic]
    const musicTitle = ["Low fi music"]
    let [musicState, setMusicState] = useState(0)
    let playNextMusic = () => {
        if (musicState < music.length - 1) {
            setMusicState(() => musicState + 1)
        } else {
            setMusicState(() => 0)
        }
    }

    return (
        <div className="music-container">
            <div className="music-button-container">
                <p className="music-title-text">Now playing: {musicTitle[musicState]}</p>
                <button className="next-button" onClick={showNextGif}>
                        Next Gif
                </button>
            </div>
            <img
                className="music-bg"
                src={gif[gifState]}
            />
            <audio controls 
                className="audio-bar"
                src={music[musicState]}
                frameBorder="0" scrolling="no"
            />

       </div>
    )
}

export default Music 