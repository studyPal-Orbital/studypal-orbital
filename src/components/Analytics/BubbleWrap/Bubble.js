import React from "react";
import { useState } from 'react';
import prepop from '../../img/prepop.svg'
import pop from '../../img/popped.svg'

import './BubbleWrap.css'

const Bubble = (props) => {
    const[bubbleState, setBubbleState] = useState(prepop)

    /* Play bubble popping sound when user clicks on a bubble */
    const popBubble = () => {
        let audio = new Audio("https://audio.jukehost.co.uk/ukFt6j6ykVkjmsX92sqF4wfexFLT2bJ2")
        audio.play()
        setBubbleState(() => pop)
    }

    return (
        <img 
            className="bubble" 
            id={props.index}
            onClick={popBubble}
            src={bubbleState}
        />
    )

}

export default Bubble
