import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import "./messenger.css"
import {initChatSocket} from "../../../socket/chatSocket"
import toast from 'react-hot-toast';
import {BsThreeDotsVertical} from "react-icons/bs"
import { updateRoom } from '../../../http';


function Messenger({setOpen, open}) {

    const user = useSelector((state) => state.auth.user);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const {id: roomId} = useParams();
    const socket = useRef(null);
    const messageRef= useRef(null);



    const ChatHandler = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        setNewMessage(e.target.value)
    }

    const submitMessage = async (e) => {
        e.preventDefault();
        console.log("Sending Message", newMessage)
        
        const data = {
            message: newMessage,
            sender:user?.name,
            roomId
        }
        await updateRoom(data)
        await socket.current.emit("SEND_MESSAGE", data)
    }

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            submitMessage(e)
        }
    };


    useEffect(()=>{
        const init = async ()=>{
            socket.current = await initChatSocket()

            // Error handling
            socket.current.on('connect_error', (err) => handleErrors(err));
            socket.current.on('connect_failed', (err) => handleErrors(err));
            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
            }

            socket.current.emit("JOIN_CHAT", {roomId, user: user?.name})
        }

        init();

    },[])


    useEffect(() => {
        socket?.current?.on("RECEIVE_MESSAGE", (message) =>{
            console.log("Message received", message)
        })
    },[socket.current, socket])


return (

    <div className='topMessengerWrapper'>

        <p className="burger" onClick = {()=> setOpen(!open)}>
            <BsThreeDotsVertical/>
        </p>
        
        <div className='messenger'>
            <div className='messengerWrap'>
                <h4>Live Chat..</h4>
                <div className='conversation'>
                    <div className='message'>
                        <p>
                            <span className='user'>Omar</span>
                            <span>{}</span>
                        </p>

                        <p className='text'>
                            This is my message for our fist conversation...
                        </p>
                    </div>
                </div>
            </div>

            <div className='SendingTextWrapper'>
                <textarea 
                className='sendingText' 
                name="" 
                id="" 
                cols="30" 
                rows="5"
                placeholder='Please enter your your message here...'
                onChange={ChatHandler}
                value={newMessage}
                ref={messageRef}
                onKeyUp={handleInputEnter}

                >
                </textarea>
            </div>
        </div>
    </div>

)
}

export default Messenger