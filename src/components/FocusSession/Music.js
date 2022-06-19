import React from 'react'
import { useState } from 'react'

import lowfi from "../gif/lowfi.gif";
import night from "../gif/night.gif";
import sunset from "../gif/sunset.gif";
import train from "../gif/train.gif";
import cat from "../gif/cat.gif";

const lowfimusic = "https://audio.jukehost.co.uk/WtwVEwikT3CkVjbxrmgmJQozQGIGxwNh"
const rain = "https://audio.jukehost.co.uk/9KZyFn9LZe3dEUZGcbeeYFGaTnngIRdk"
const piano = "https://audio.jukehost.co.uk/NRBNwbGvK958VO0BW0H2fbayStV9O7ro"

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

    const music = [lowfimusic, piano, rain]
    const musicTitle = ["Low fi music","Studo Ghibli piano cover music", "Sounds of nature (rain and forest)"]
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
                <button className="next-button" onClick={playNextMusic}>
                        Next Song
                </button>
            </div>
            <img
                className="music-bg"
                src={gif[gifState]}
            />
            <iframe
                className="audio-bar"
                src={music[musicState]}
                frameBorder="0" scrolling="no"
            />
       </div>
    )
}

export default Music 