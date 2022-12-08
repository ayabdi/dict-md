import MDEditor from "@uiw/react-md-editor"
// import "@uiw/react-md-editor/dist/markdown-editor.css";
import React, { useState, useEffect, useRef } from "react"
import { Button } from "react-bootstrap"
import "./App.css"
import { ReactMic } from "react-mic"
import axios from "axios"

export const Markdown = (props: any) => {
  const [value, setValue] = React.useState("")
  const [transcribedData, setTranscribedData] = useState("")
  const [interimTranscribedData] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [selectedModel, setSelectedModel] = useState(1)
  const [transcribeTimeout, setTranscribeTimout] = useState(5)
  const [stopTranscriptionSession, setStopTranscriptionSession] = useState(false)

  const intervalRef = useRef(null)

  const stopTranscriptionSessionRef = useRef(stopTranscriptionSession)
  stopTranscriptionSessionRef.current = stopTranscriptionSession

  const selectedLangRef = useRef(selectedLanguage)
  selectedLangRef.current = selectedLanguage

  const selectedModelRef = useRef(selectedModel)
  selectedModelRef.current = selectedModel

  const modelOptions = ["tiny", "base", "small", "medium", "large"]

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  function startRecording() {
    setStopTranscriptionSession(false)
    setIsRecording(true)
    intervalRef.current = setInterval(transcribeInterim, transcribeTimeout * 1000)
  }

  function stopRecording() {
    clearInterval(intervalRef.current)
    setStopTranscriptionSession(true)
    setIsRecording(false)
    setIsTranscribing(false)
  }

  function onData(recordedBlob: any) {
    // console.log('chunk of real-time data is: ', recordedBlob);
  }
  
  function onStop(recordedBlob: any) {
    transcribeRecording(recordedBlob)
    setIsTranscribing(true)
  }

  function transcribeInterim() {
    clearInterval(intervalRef.current)
    setIsRecording(false)
  }

  function transcribeRecording(recordedBlob: { blob: string | Blob }) {
    const headers = {
      "content-type": "multipart/form-data"
    }
    const formData = new FormData()
    formData.append("language", selectedLangRef.current)
    formData.append("model_size", modelOptions[selectedModelRef.current])
    formData.append("audio_data", recordedBlob.blob, "temp_recording")
    axios.post("http://127.0.0.1:8000/transcribe", formData, { headers }).then(res => {
      setTranscribedData(oldString => oldString + res.data)
      setIsTranscribing(false)
      intervalRef.current = setInterval(transcribeInterim, transcribeTimeout * 500)
    })

    if (!stopTranscriptionSessionRef.current) {
      setIsRecording(true)
    }
  }
  

  return (
    <div className="">
      <div>
        {!isRecording && !isTranscribing && (
          <Button onClick={startRecording} variant="primary">
            Start transcribing
          </Button>
        )}
        {(isRecording || isTranscribing) && (
          <Button onClick={stopRecording} variant="danger" disabled={stopTranscriptionSessionRef.current}>
            Stop
          </Button>
        )}
      </div>

      <div className="recordIllustration">
        <ReactMic record={isRecording} className="sound-wave" onStop={onStop} onData={onData} strokeColor="#0d6efd" backgroundColor="#f6f6ef" />
      </div>
      <MDEditor height={500} value={transcribedData} onChange={setTranscribedData} />
    </div>
  )
}
