import React from "react";

const Comment = (props) => {
    return (
        <div>
            <p>{props.comment}</p>
            <p>{props.email}</p>
        </div>
    )
}

export default Comment