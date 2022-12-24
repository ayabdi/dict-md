import os
import tempfile
import flask
from flask import request
from flask_cors import CORS
from flask_socketio import SocketIO,emit
import speech_recognition as sr
from engineio.async_drivers import eventlet
import tqdm
# import whisper

app = flask.Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*", async_mode="eventlet",logger=True, engineio_logger=True)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connect",{"data":f"id: {request.sid} is connected"})
    

    
@socketio.on('record')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ",str(data))

    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say something!")
        audio = r.listen(source)

    try:
        print("Whisper thinks you said " + r.recognize_whisper(audio, language="english"))
        emit("data",{'data':r.recognize_whisper(audio, language="english"),'id':request.sid},broadcast=True)
    except sr.UnknownValueError:
        print("Whisper could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Whisper")

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True,port=5001)