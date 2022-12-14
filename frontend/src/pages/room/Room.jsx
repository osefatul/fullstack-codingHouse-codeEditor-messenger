import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditorPage from '../../components/roomComp/codeEditor/EditorPage'
import Messenger from '../../components/roomComp/messenger/Messenger';
import OnlineRoomUsers from '../../components/roomComp/OnlineRoomUsers/OnlineRoomUsers';
import {GiHamburgerMenu} from "react-icons/gi"
import "./room.css"
import { getRoom } from '../../http';



function Room() {
    const user = useSelector((state) => state.auth.user);
    const { id: roomId } = useParams();
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);
    const [room, setRoom] = useState(null);

    
    const fetchRoom = async () => {
        const { data } = await getRoom(roomId);
        // console.log(data)
        setRoom((prev) => data);
    };

    useEffect(() => {
        fetchRoom();
    }, [])


    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getRoom(roomId);
            setRoom((prev) => data);
        };
        fetchRoom();
    }, [roomId]);



return (
    <div className='room'>

        {/* {
            leftOpen ?
            <div className={`leftSide ${leftOpen? "": "leftOpen"}`}>
                <OnlineRoomUsers 
                setOpen={setLeftOpen} 
                open={leftOpen} 
                room={room}
                setRoom={setRoom}
                />
            </div>
            :
            <div className='closedLeftSide'>
                <p onClick = {()=> setLeftOpen(!leftOpen)}><GiHamburgerMenu/></p>
            </div>
        } */}

        {/* if we use the above method then it will completely remove the tag from DOM. adn when room is removed from the dom then the user will be removed from audio call */}
        
        <div className={`leftSide ${leftOpen? "": "leftOpen"}`}>
            <OnlineRoomUsers 
            setOpen={setLeftOpen} 
            open={leftOpen} 
            room={room}
            setRoom={setRoom}
            />
        </div>
        
        <div className={`closedLeftSide ${leftOpen? "leftOpen": ""}`}>
            <p onClick = {()=> setLeftOpen(!leftOpen)}><GiHamburgerMenu/></p>
        </div>
        

        <div className='center'>
            <EditorPage/>
        </div>

        {
            rightOpen ?
                <div className='rightSide'>
                    <Messenger setOpen={setRightOpen} open={rightOpen}/>
                </div>
                :
                <div className='closedRightSide'>
                    <p onClick = {()=> setRightOpen(!rightOpen)}><GiHamburgerMenu/></p>
                </div>
        }

    </div>
)
}

export default Room