import {io}  from "socket.io-client"


export const initChatSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    // return io("http://localhost:8000", options);
    // return io(process.env.REACT_APP_BACKEND_URL, options);
    return io("https://codeeditor-messenger-micro.herokuapp.com", options);
};