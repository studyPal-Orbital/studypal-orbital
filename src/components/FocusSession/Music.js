import React, { useEffect } from 'react'
import { useState } from 'react'

import lowfi from "../gif/lowfi.gif";
import night from "../gif/night.gif";
import sunset from "../gif/sunset.gif";
import train from "../gif/train.gif";
import cat from "../gif/cat.gif";

import {db} from "../../firebase.js"
import { UserAuth } from '../../context/AuthContext'

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


const lowfimusic = "https://audio.jukehost.co.uk/WtwVEwikT3CkVjbxrmgmJQozQGIGxwNh"
const piano = "https://audio.jukehost.co.uk/n5uO2ci9N1vE0QrBEUzPVBDIZpAPhKeg"
const audiomachine = "https://d2plt0bjayjk67.cloudfront.net/audiomachine.mp3"
const odesza = "https://d2plt0bjayjk67.cloudfront.net/odesza.mp3"
const naruto = "https://d2plt0bjayjk67.cloudfront.net/naruto-instrumental.mp3"

const songTitles = ['Celtic Battle', 
                    'Rain lo-fi', 
                    'Audiomachine ', 
                    'Movie soundtracks', 
                    'Jazz-hop lo-fi', 
                    'Indie games lo-fi', 
                    'Anime piano covers', 
                    'Beach', 
                    'Studio Ghibli piano covers',
                    'Classic lo-fi ', 
                    'Workout EDM', 
                    'Odesza',
                    'Forest', 
                    'Gaming EDM', 
                    'Rain', 
                    'English pop songs piano cover', 
                    'Fire ', 
                    'Happy tropical EDM', 
                    'Kpop songs piano cover', 
                    'Hans Zimmer soundtrack']
                
const songs = [lowfimusic, piano,audiomachine, odesza, naruto]

const gif = [lowfi, night, sunset, train, cat]

const Music = () => {

    const {user}  = UserAuth()

    const [songs, setSongs] = useState([])
    const [genreCategorySongs, setGenreCategorySongs] = useState([])
    const [genreCategorySongTitles, setGenreCategorySongTitles] = useState(songTitles)

    const [ genre, setSelectedGenre ] = useState("All")
    const [ gifState, setGifState ] = useState(0)
    const [ userSongSearchInput, setUserSongSearchInput ] = useState("")
    const [ userSelectedSongTitle, setUserSelectedSongTitle ] = useState("")
    const [ userSelectedSongTrack, setUserSelectedSongTrack ] = useState(songs[0])
    const [ collapseSearchBar, setCollapseSearchBar ] = useState(false)

    useEffect((e) => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "songs"))
            console.log("Retrieving songs")
            const getAllSongs = onSnapshot(q, (querySnapshot) => {
                let allSongs = []
                querySnapshot.forEach((doc) => {
                    allSongs.push({...doc.data()})
                })
                setSongs(() => allSongs)
                console.log(allSongs)
            })}
    }, [user.uid])

    let updateSongGenre = (e) => {
        setSelectedGenre(() => e.target.value)
        let filteredSongs = songs.filter((song) => e.target.value != "All" ? song['genre'] == e.target.value : songs)
        let filteredSongsTitle = filteredSongs.map((song) => song['title'])
        setGenreCategorySongs(() => filteredSongs)
        setGenreCategorySongTitles(() => filteredSongsTitle)
    }


    let showNextGif = () => {
        if (gifState < gif.length-1) {
            setGifState(() => gifState + 1)
        } else {
            setGifState(() => 0)
        }
    }

    const recordUserSongSearchInput = (e) => {
        setCollapseSearchBar(() => false)
        setUserSongSearchInput(() => e.target.value)
    }

    const recordUserSelectedSong = (e) => {
        let songSelected = songs.filter((song) => song['title'] == e.target.value)[0]['link']
        console.log(songSelected)
        setUserSelectedSongTrack(() => songSelected)
        setUserSelectedSongTitle(() => e.target.value)
        setUserSongSearchInput(() => e.target.value)
        setCollapseSearchBar(() => true)
    }


    return (
        <div className="music-container">
            <div className="music-button-container">
                <select className="music-genre-select" onChange={updateSongGenre}>
                    <option value={"All"}>All</option>
                    <option value={"lo-fi"}>Lo-fi</option>
                    <option value={"piano"}>Piano</option>
                    <option value={"epic cinematic"}>Epic cinematic</option>
                    <option value={"EDM"}>EDM</option>
                    <option value={"Sounds of nature"}>Sounds of nature</option>
                </select>

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
                    {collapseSearchBar == false && userSongSearchInput != "" && genreCategorySongTitles.map((song) => {
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
            {userSelectedSongTitle != "" && <audio controls 
                className="audio-bar"
                frameBorder="0" scrolling="no"
                autoPlay="true"
                src={userSelectedSongTrack}
            />}
       </div>
    )
}

export default Music 