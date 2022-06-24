import React from "react";
import cat from '../img/bongo-cat.png'

const Comment = (props) => {
    return (
        <div className="comment-container">
            <div className="comment-img-container">
                <img className="user-comment-profile" src={cat}></img>
            </div>
            <div className="comment-content-container">
                <p className="comment-content-user">Created by : {props.email}</p>
                <p className="comment-content-body">{props.comment}</p>
            </div>
        </div>
    )
}

export default Comment