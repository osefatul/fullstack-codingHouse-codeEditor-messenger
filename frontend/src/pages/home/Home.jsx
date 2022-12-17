import React from 'react'
import Button from '../../components/shared/button/Button'
import Card from '../../components/shared/card/Card'
import styles from './home.module.css';
import { Link, useNavigate } from 'react-router-dom';



function Home() {

    const signInLinkStyle = {
        color: '#0077ff',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginLeft: '10px',
    };

    
    const history = useNavigate();
    function startRegister() {
        history('/authenticate');
    }

    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Codershouse!" icon="logo">
                <p className={styles.text}>
                    We’re working hard to get Coding house ready for everyone!
                    Coding house is a community of software developers, aspirants, teachers and students to get together and share their skills.
                </p>
                <div>
                    <Button onClick={startRegister} text="Let's Go" />
                </div>
                <div className={styles.signinWrapper}>
                    <span className={styles.hasInvite}>
                        Have an invite text?
                    </span>
                </div>
            </Card>
        </div>
    )
}

export default Home