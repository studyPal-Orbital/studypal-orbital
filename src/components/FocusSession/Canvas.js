import React from 'react'
import './FocusSession.css'
import { useEffect, useRef, useState } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = window.innerWidth ;
        canvas.height = window.innerHeight * 1.5;
        canvas.style.width =`${window.innerwidth}px`
        canvas.style.height = `${window.innerHeight}px`

        const context = canvas.getContext("2d")
        context.scale(1.75,1.8)
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 4
        contextRef.current = context
        }, [])

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX,offsetY)
        setIsDrawing(true)
    }

    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({nativeEvent}) => {
        if (!isDrawing) {
            return 
        }
        const {offsetX, offsetY} = nativeEvent
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }
    return (
        <canvas
            className="canvas"
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
        />   
    )
}


export default Canvas