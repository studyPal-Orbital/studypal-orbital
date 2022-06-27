import React from 'react'
import './FocusSession.css'
import { useEffect, useRef, useState } from 'react';

const Canvas = () => {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = 1300
        canvas.height = 700
        canvas.style.width = 1300
        canvas.style.height = 700

        const context = canvas.getContext("2d")
        context.scale(1,1)
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 3
        context.lineJoin = "round"
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