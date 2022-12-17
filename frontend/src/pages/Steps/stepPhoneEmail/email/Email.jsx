import React, { useState } from 'react';
import Card from '../../../../components/shared/card/Card';
import Button from '../../../../components/shared/button/Button';
import TextInput from '../../../../components/shared/textInput/TextInput';
import styles from '../stepPhoneEmail.module.css';
import { useDispatch } from 'react-redux';
import { sendOtp } from '../../../../http';
import { setOtp } from '../../../../features/authSlice';




const Email = ({ onNext }) => {
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();


    async function submit() {
        const { data } = await sendOtp({ email:email });
        // console.log(data);
        dispatch(setOtp({ email: data.email, hash: data.hash }));
        onNext();
    }

    
    return (
        <Card title="Enter your email:" icon="email-emoji">
            <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div>
                <div className={styles.actionButtonWrap}>
                    <Button text="Next" onClick={submit} />
                </div>
                <p className={styles.bottomParagraph}>
                    By entering your email, you’re agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    );
};

export default Email;