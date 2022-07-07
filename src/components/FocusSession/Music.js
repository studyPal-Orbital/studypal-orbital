import React from 'react'
import { useState } from 'react'

import lowfi from "../gif/lowfi.gif";
import night from "../gif/night.gif";
import sunset from "../gif/sunset.gif";
import train from "../gif/train.gif";
import cat from "../gif/cat.gif";

import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const lowfimusic = "https://audio.jukehost.co.uk/WtwVEwikT3CkVjbxrmgmJQozQGIGxwNh"
const piano = "https://audio.jukehost.co.uk/n5uO2ci9N1vE0QrBEUzPVBDIZpAPhKeg"

const songTitles = ["Low fi Music", "Studio Ghibli Piano"]
const songs = [lowfimusic, piano]
const gif = [lowfi, night, sunset, train, cat]

const Music = () => {

    let [gifState, setGifState] = useState(0)
    let showNextGif = () => {
        if (gifState < gif.length-1) {
            setGifState(() => gifState + 1)
        } else {
            setGifState(() => 0)
        }
    }

    const [ userSongSearchInput, setUserSongSearchInput ] = useState("")
    const [ userSelectedSongTitle, setUserSelectedSongTitle ] = useState("")
    const [ userSelectedSongTrack, setUserSelectedSongTrack ] = useState(songs[0])
    const [ collapseSearchBar, setCollapseSearchBar ] = useState(false)

    const recordUserSongSearchInput = (e) => {
        setCollapseSearchBar(() => false)
        setUserSongSearchInput(() => e.target.value)
    }

    const recordUserSelectedSong = (e) => {
        let songIndex = songTitles.indexOf(e.target.value)
        setUserSelectedSongTrack(() => songs[songIndex])
        setUserSelectedSongTitle(() => e.target.value)
        setUserSongSearchInput(() => e.target.value)
        setCollapseSearchBar(() => true)
    }


    return (
        <div className="music-container">
            <div className="music-button-container">
                <input
                    placeholder={"Search for songs"}
                    value={userSongSearchInput}
                    onChange={recordUserSongSearchInput}
                    className={"music-search-bar"}
                />
                <button className="next-button" onClick={showNextGif}>
                        Next Gif
                </button>
                </div>
                <div className="music-search-options-container">
                    {collapseSearchBar == false && userSongSearchInput != "" && songTitles.map((song) => {
                        if (song.toLocaleLowerCase().match(userSongSearchInput.toLocaleLowerCase())) {
                            return (
                                <button 
                                    value={song} 
                                    onClick={recordUserSelectedSong}
                                    className={"music-search-option"}
                                >
                                    {song}
                                </button>
                    )}})}
                </div>
            <img
                className="music-bg"
                src={gif[gifState]}
            />
            <audio controls 
                className="audio-bar"
                frameBorder="0" scrolling="no"
                src={userSelectedSongTrack}
            />

       </div>
    )
}

export default Music 