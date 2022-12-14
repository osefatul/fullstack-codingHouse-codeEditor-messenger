import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebRTC } from '../../../hooks/useWebRTC';
import { getRoom } from '../../../http';
import styles from './onlineRoomUsers.module.css';
import {BsXSquareFill, BsFillArrowLeftSquareFill} from "react-icons/bs"


function OnlineRoomUsers({setOpen, open, room}) {

    const user = useSelector((state) => state.auth.user);
    const [isMuted, setMuted] = useState(true);

    const navigate = useNavigate();
    const { id: roomId } = useParams();
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);


    useEffect(() => {
        handleMute(isMuted, user.id);
    }, [isMuted]);


    const handManualLeave = () => {
        navigate('/rooms');
    };

    const handleMuteClick = (clientId) => {
        if (clientId !== user.id) {
            return;
        }
        setMuted((prev) => !prev);
    };



    return (
    <div className={styles.topRoom}>

        <p className={styles.burger} onClick = {()=> setOpen(!open)}>
            <BsXSquareFill/>
        </p>
    
        <div className={styles.room}>
            <div>
                <button 
                onClick={handManualLeave} 
                className={styles.goBack}>
                    {/* <img src="/images/arrow-left.png" alt="arrow-left" /> */}
                    <BsFillArrowLeftSquareFill style={{color:"white", fontSize:"16px"}}/>
                    <span>Go back</span>
                </button>
            </div>

            <div className={styles.clientsWrap}>

                <div className={styles.header}>
                    {room && <span className={styles.topic}>#{room.topic}</span>}
                </div>

                <p className={styles.online}>Online</p>

                <div className={styles.clientsList}>
                    {clients.map((client) => {
                        return (
                            <div className={styles.client} key={client.id}>
                                <div className={styles.userHead}>
                                    <img
                                        className={styles.userAvatar}
                                        src={client.avatar}
                                        alt=""
                                    />
                                    <audio
                                        autoPlay
                                        ref={(instance) => {
                                            provideRef(instance, client.id);
                                        }}
                                    />
                                    <button
                                        onClick={() =>handleMuteClick(client.id)}
                                        className={styles.micBtn}
                                    >
                                        {client.muted ? (
                                            <img
                                                className={styles.mic}
                                                src="/images/mic-mute.png"
                                                alt="mic"
                                            />
                                        ) : (
                                            <img
                                                className={styles.micImg}
                                                src="/images/mic.png"
                                                alt="mic"
                                            />
                                        )}
                                    </button>
                                </div>
                                <h4>{client.name}</h4>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    </div>
    );
};

export default OnlineRoomUsers