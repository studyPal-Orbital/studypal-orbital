import React from "react";
import cat from '../img/bongo-cat.png'
import DeleteIcon from "@mui/icons-material/Delete"

import { UserAuth } from '../../context/AuthContext'
import { db } from "../../firebase"
import {    doc,
            deleteDoc } from 'firebase/firestore'

const Comment = (props) => {
    const {user}  = UserAuth()

    const deleteComment = async () => {
        await deleteDoc(doc(db, "comments", props.id))
    }

    return (
        <div className="comment-container">
            <div className="comment-img-container">
                <img className="user-comment-profile" src={cat}></img>
                {user.uid == props.userID ? 
                <button className="delete-comment" onClick={deleteComment}>
                    <DeleteIcon/>
                </button> 
                : <></>
                }
            </div>
            <div className="comment-content-container">
                <p className="comment-content-user">Created by : {props.email}</p>
                <p className="comment-content-body">{props.comment}</p>
            </div>
        </div>
    )
}

export default Comment