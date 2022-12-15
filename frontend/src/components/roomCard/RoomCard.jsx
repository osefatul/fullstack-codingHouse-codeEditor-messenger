
import React from 'react';
import styles from './roomCard.module.css';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
    const history = useNavigate();

    // console.log(room)

    return (
        <div
            onClick={() => {history(`/room/${room.id}`);}}
            className={styles.card}>
            
            <div className={styles.topicNImg}>
                <h3 className={styles.topic}>
                    {room.topic.length>50 ? 
                    <div>{room.topic.split(0,50)}...</div>
                    :room.topic}
                </h3>
                {
                    room.roomType === "open"?
                    <img 
                    className={styles.roomType} 
                    src="/images/globe.png" alt="globe" />:
                    room.roomType === "private"?
                    <img className={styles.roomType} 
                    src="/images/lock.png" alt="lock" />:
                    <img className={styles.roomType} 
                    src="/images/social.png" alt="social" />
                }
            </div>

            <div
                className={`${styles.speakers} ${
                    room.speakers.length === 1 ? styles.singleSpeaker : ''
                }`}>

                <div className={styles.avatars}>
                    {room.speakers.map((speaker) => (
                        <img
                            key={speaker.id}
                            src={speaker.avatar}
                            alt="speaker-avatar"
                        />
                    ))}
                </div>
                
                <div className={styles.names}>
                    {room.speakers.map((speaker) => (
                        <div key={speaker.id} className={styles.nameWrapper}>
                            <span>{speaker.name}</span>
                            <img
                                src="/images/chat-bubble.png"
                                alt="chat-bubble"
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            <div className={styles.peopleCount}>
                <span>{room.totalPeople}</span>
                <img src="/images/user-icon.png" alt="user-icon" />
            </div>
        </div>
    );
};

export default RoomCard;