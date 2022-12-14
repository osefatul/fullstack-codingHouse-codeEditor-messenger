import React, { useEffect, useState } from 'react';
import styles from './rooms.module.css';
import { getAllRooms, getSpecificRooms } from '../../http';
import RoomCard from '../../components/roomCard/RoomCard';
import AddRoomModal from '../../components/addRoomModal/AddRoomModal';
import { useSelector } from 'react-redux';



const dummyRooms = [
    {
        id: 1,
        topic: 'Which framework best for frontend ?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 3,
        topic: 'What’s new in machine learning?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 4,
        topic: 'Why people use stack overflow?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 5,
        topic: 'Artificial inteligence is the future?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
];


const Rooms = () => {

    const {user} = useSelector(state => state.auth)
    const [selectRooms, setSelectRooms] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);
    const [rooms, setRooms] = useState([]);

    const roomOptions = [
        {id:0, name:"All Rooms", roomType:"All"},
        {id:1,name:"Public Rooms", roomType:"open"},
        {id:2,name:"Private Rooms", roomType:"private"}
    ]


    const fetchRooms = async () => {
        const { data } = await getAllRooms({userId: user?.id});
        setRooms(data);
        setData(data)
        console.log(data)
    };

    useEffect(() => {
        fetchRooms();
    }, []);


    // Filter
    const searchRoom = (e)=>{
        e.preventDefault();
        
        setData(data.filter( r => {
            if(!e.target.value){
                fetchRooms();
            }
            else{
                return r.topic.toLowerCase().includes(e.target.value.toLowerCase())
            }
        }))
    }

    useEffect(()=>{
        setRooms(data)
    },[data])


    useEffect(()=>{
        
        const filterRooms = async () => {
            const roomName = await roomOptions[selectRooms].roomType;

            if(roomName === "All"){
                fetchRooms()
            }
            else{
                const {data} = await getSpecificRooms(
                    {roomType:roomName, userId:user?.id})
                setRooms(data);
                setData(data)
                console.log(data)
            }
        }
        filterRooms()
    },[selectRooms])


    const handleRooms = async (index) => {
        setSelectRooms(index)
    }

    
    
    return (
        <>
            <div className="container">
                <div className={styles.roomsHeader}>
                    <div className={styles.left}>
                        {
                            roomOptions.map((option, index) =>(
                                <span key={index} 
                                className={`${styles.heading} ${selectRooms === index ? styles.active : ""}`}
                                onClick={() => handleRooms(index)}
                                >
                                    {option.name}
                                </span>
                            ))
                        }
                    </div>

                    <div className={styles.right}>
                        <button
                            onClick={() => setShowModal(true)}
                            className={styles.startRoomButton}>
                            <img
                                src="/images/add-room-icon.png"
                                alt="add-room"
                            />
                            <span>Start a room</span>
                        </button>
                    </div>
                </div>

                <div className={styles.searchBox}>
                    <img src="/images/search-icon.png" alt="search" />
                    <input type="text" className={styles.searchInput} onChange={searchRoom}/>
                </div>

                <div className={styles.roomList}>
                    {rooms.map((room) => (
                        
                        <RoomCard className={styles.roomCard} key={room.id} room={room} />
                    ))}
                </div>
            </div>
            {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
        </>
    );
};

export default Rooms;