import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditorPage from '../../components/roomComp/codeEditor/EditorPage'
import Messenger from '../../components/roomComp/messenger/Messenger';
import OnlineRoomUsers from '../../components/roomComp/OnlineRoomUsers/OnlineRoomUsers';
import {GiHamburgerMenu} from "react-icons/gi"
import "./room.css"



function Room() {
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);



return (
    <div className='room'>

        {
            leftOpen ?
            <div className='leftSide'>
                <OnlineRoomUsers setOpen={setLeftOpen} open={leftOpen}/>
            </div>
            :
            <div className='closedLeftSide'>
                <p onClick = {()=> setLeftOpen(!leftOpen)}><GiHamburgerMenu/></p>
            </div>
        }


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