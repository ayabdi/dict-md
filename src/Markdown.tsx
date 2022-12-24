import MDEditor from "@uiw/react-md-editor"
// import "@uiw/react-md-editor/dist/markdown-editor.css";
import React, { useState, useEffect, useRef } from "react"
import { Button } from "react-bootstrap"
import "./App.css"
import { io } from "socket.io-client"

import { textToKey } from "./utils/keys"

const socket = io("localhost:5001/")

export const Markdown = () => {
  const [transcribedData, setTranscribedData] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [stopTranscriptionSession, setStopTranscriptionSession] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (isRecording) {
      socket.on("data", res => {
        const { data } = res

        setTranscribedData(oldString => oldString + textToKey(data))
        socket.emit("record", "start")
      })
    }
    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("record")
    }
  }, [isRecording])

  function startRecording() {
    socket.emit("record", "start")
    setIsRecording(true)
  }

  function stopRecording() {
    setIsRecording(false)
    setIsTranscribing(false)
    setStopTranscriptionSession(true)
  }

  return (
    <div className="" style={{ height: '100vh', width: '100%'}}>
      <div >
        {!isRecording && !isTranscribing && (
          <Button onClick={startRecording} variant="primary" style={{zIndex: 999999, position: 'fixed'}}>
            Start transcribing
          </Button>
        )}
        {(isRecording || isTranscribing) && (
          <Button onClick={stopRecording} variant="danger" disabled={stopTranscriptionSession}>
            Stop
          </Button>
        )}
      </div>

      <MDEditor height={'100%'} style={{width: '100%'}} value={transcribedData} onChange={setTranscribedData} />
    </div>
  )
}
