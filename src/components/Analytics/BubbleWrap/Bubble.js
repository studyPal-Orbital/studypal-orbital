import React from "react";
import { useState, useRef } from 'react';
import prepop from '../../img/prepop.svg'
import pop from '../../img/popped.svg'

import './BubbleWrap.css'

const Bubble = (props) => {
    const[bubbleState, setBubbleState] = useState(prepop)

    const popBubble = () => {
        let audio = new Audio("https://audio.jukehost.co.uk/ukFt6j6ykVkjmsX92sqF4wfexFLT2bJ2")
        audio.play()
        setBubbleState(() => pop)
    }
    return (
        <img 
            className="bubbles" 
            id={props.index}
            onClick={popBubble}
            src={bubbleState}
        />
    )

}

export default Bubble
