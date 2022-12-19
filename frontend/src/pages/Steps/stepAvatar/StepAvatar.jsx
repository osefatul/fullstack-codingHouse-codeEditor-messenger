import React, { useEffect, useState } from 'react';
import Card from '../../../components/shared/card/Card';
import Button from '../../../components/shared/button/Button';
import styles from './stepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../features/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../features/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../components/shared/loader/Loader';
import axios from 'axios';



const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [file, setFile] = useState();


    // console.log(location.state.from.pathname)


    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState('/images/monkey-avatar.png');
    const [loading, setLoading] = useState(false);
    const [unMounted, setUnMounted] = useState(false);


    async function captureImage(e) {

        //Method used for local storage on backend side..
        // const file = e.target.files[0];
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function () {
        //     setImage(reader.result);
        //     dispatch(setAvatar(reader.result));
        // };

        const data = new FormData();
        try{
            setFile(e.target.files[0])
            if(file){
                data.append("file", file);
                data.append("upload_preset", "coding-house")

                const uploadPic = await axios.post(
                "https://api.cloudinary.com/v1_1/ddgn3r0t2/image/upload",
                data, 
                axios.defaults.withCredentials = false
                )

                const {url} = uploadPic.data;
                dispatch(setAvatar(url));
            }
        }catch(e){
            console.log(e)
        }
    }



    async function submit() {

        try{
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "coding-house")

            const uploadPic = await axios.post(
            "https://api.cloudinary.com/v1_1/ddgn3r0t2/image/upload",
            data, 
            axios.defaults.withCredentials = false
            )

            const {url} = uploadPic.data;
            dispatch(setAvatar(url));
            console.log(url)
            
        }catch(e){
            console.log(e)
        }

        // if (!name || !avatar) return;
        // setLoading(true);

        try {
            if(avatar){
                const { data } = await activate({ name, avatar });
                data.auth && data.user.activated && dispatch(setAuth(data));
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader message="Activation in progress..." />;

    return (
        <>
            <Card title={`Okay, ${name}`} icon="monkey-emoji">
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={file? URL.createObjectURL(file): image}
                        alt="avatar"
                    />
                </div>
                <div>
                    <input
                        onChange={(e)=> setFile(e.target.files[0]) }
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};


export default StepAvatar;