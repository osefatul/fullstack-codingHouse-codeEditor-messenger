import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditorPage from '../../components/roomComp/codeEditor/EditorPage'
import Messenger from '../../components/roomComp/messenger/Messenger';
import OnlineRoomUsers from '../../components/roomComp/OnlineRoomUsers/OnlineRoomUsers';
import "./room.css"


function Room() {
    const user = useSelector((state) => state.auth.user);
    const { id: roomId } = useParams();
    console.log(roomId)



return (
    <div className='room'>
            <OnlineRoomUsers roomId={roomId} user={user}/>
            <EditorPage/>
            <Messenger/>
    </div>
)
}

export default Room