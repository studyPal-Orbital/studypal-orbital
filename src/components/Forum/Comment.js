import React from "react";
import cat from '../img/bongo-cat.png'
import DeleteIcon from "@mui/icons-material/Delete"
import { UserAuth } from '../../context/AuthContext'
import { db } from "../../firebase"
import { doc,
         deleteDoc } from 'firebase/firestore'

const Comment = (props) => {
    const {user}  = UserAuth()

    /* Delete user selected comment from firebase */
    const deleteComment = async () => {
        await deleteDoc(doc(db, "comments", props.id))
    }

    return (
        <div id="comment-container">
            <div id="comment-img-container">
                <img id="user-comment-profile" src={cat}></img>
                {user.uid == props.userID ? 
                <button id="delete-comment" data-cy="delete-comment" onClick={deleteComment}>
                    <DeleteIcon/>
                </button> 
                : <></>
                }
            </div>
            <div id="comment-content-container">
                <p id="comment-content-user">Created by : {props.displayName}</p>
                <p id="comment-content-body">{props.comment}</p>
            </div>
        </div>
    )
}

export default Comment