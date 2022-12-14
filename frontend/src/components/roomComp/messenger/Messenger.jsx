import React, { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import "./messenger.css"
import {initChatSocket} from "../../../socket/chatSocket"
import toast from 'react-hot-toast';
import {BsXSquareFill} from "react-icons/bs"
import { getRoom, updateRoom } from '../../../http';


function Messenger({setOpen, open}) {

    const user = useSelector((state) => state.auth.user);
    const [receivedMessage, setReceivedMessage] = useState()
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const {id: roomId} = useParams();
    const socket = useRef(null);
    const messageRef= useRef(null);


    const getChats = async ()=>{
        const { data } = await getRoom(roomId);
        setMessages(data.conversation);
        messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(()=>{
        getChats()
        messageRef.current?.scrollIntoView({ behavior: "smooth" });

    },[])


    const ChatHandler = (e) => {
        setNewMessage(e.target.value)
    }

    const submitMessage = async (e) => {
        e.preventDefault();
        
        const data = {
            message: newMessage,
            sender:user?.name,
            roomId:roomId
        }

        await updateRoom(data) //send message to database
        //send message to socket server
        await socket.current.emit("SEND_MESSAGE", data)

        //get the sent message from db in order to render them...
        await getChats() 
    }

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            submitMessage(e)
            setNewMessage("")
        }
    };

    //when component is mounted
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

            // Always scroll to last Message
            messageRef.current?.scrollIntoView({ behavior: "smooth" });

    },[])


    // When we received message form server...
    useEffect(() => {
        if(socket.current)
        {
            socket.current.on("RECEIVE_MESSAGE", ({roomId, message}) =>{
                setReceivedMessage({roomId, message})

                // once we receive a message then show this to the receiver. and get message frm db
                getChats() 
            })
        }
    },[socket.current, socket])


return (
    <div className='topMessengerWrapper' >

        <p className="burger" onClick = {()=> setOpen(!open)}>
            <BsXSquareFill/>
        </p>
        
        <div className='messenger'>
            <div className='messengerWrap'>
                <h4>Live Chat</h4>
                <div className='conversation'>

                    {messages?.map((message) =>(
                        <div>
                                <span className='user'>@{message?.sender}</span>
                            
                            <div className={`message ${message?.sender === user.name? "userMessage":""}`}>
                                <p>
                                    <span className='msgAt'>
                                        {new Date(message.msgAt).toLocaleString()}
                                    </span>
                                </p>

                                <p className='text'
                                ref={messageRef}>
                                    {message?.message}
                                </p>

                            </div>
                            
                        </div>

                    ))}
                </div>
            </div>

            <div className='SendingTextWrapper'>
                <textarea 
                className='sendingText' 
                placeholder='Please enter your your message here...'
                onChange={ChatHandler}
                value={newMessage}
                // ref={messageRef}
                onKeyUp={handleInputEnter}
                >
                </textarea>
            </div>
        </div>
    </div>

)
}

export default Messenger