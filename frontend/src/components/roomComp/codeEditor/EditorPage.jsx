import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import EditorCom from './EditorComp';
import { initSocket } from '../../../socket/editorSocket';
import EditorButton from '../../shared/editorButton/EditorButton';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';
import "./codeEditor.css"
import { useSelector } from 'react-redux';
import { getRoom } from '../../../http';



const EditorPage = ({code, setRoom}) => {

    const [codes, setCodes] = useState()

    const [openedEditor, setOpenedEditor] = useState("html");
    const [activeButton, setActiveButton] = useState("html");

    

    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");

    const [srcDoc, setSrcDoc] = useState(``);
    const { id: roomId } = useParams();


    // ------------------------------
    
    const fetchRoom = async () => {
        const { data } = await getRoom(roomId);
        console.log(data)
        await setCodes((prev) => data.code[0]);
    };

    useEffect(() => {
        fetchRoom();
    }, [])

    useEffect(() => {
        console.log(codes)
        setHtml(codes?.xml)
        setCss(codes?.css);
        setJs(codes?.js)

    }, [codes, setCodes, roomId]);
    // ------------------------------


    const user = useSelector((state) => state.auth.user);
    // console.log(roomId)


    const onTabClick = (editorName) => {
        setOpenedEditor(editorName);
        setActiveButton(editorName);
    };

    useEffect(() => {
    const timeOut = setTimeout(() => {
        setSrcDoc(
        `
            <html>
                <body>${html}</body>
                <style>${css}</style>
                <script>${js}</script>
            </html>
        `
            )
        }, 400);

        return () => clearTimeout(timeOut)
    }, [html, css, js])

    // We use useRef hook to persist values between renders
    const socketRef = useRef(null);


    const htmlCodeRef = useRef(null);
    const cssCodeRef = useRef(null);
    const JsCodeRef = useRef(null);


    const reactNavigator = useNavigate();
    

    useEffect(() => {

        const init = async ()=> {
            socketRef.current = await initSocket()
            // console.log(socketRef)

            // Error handling
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }


            // Send roomId and user to server
            socketRef.current.emit("JOIN", {
                roomId,
                username: user?.name,
            });


            // Listening for joined event
            socketRef.current.on(
                "JOINED",
                ({ clients, username, socketId }) => {
                    if (username !== user) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    
                    //once you join the room sync codes in each tab.
                    socketRef.current.emit("XML_SYNC_CODE", {
                        code: htmlCodeRef.current,
                        socketId,
                    });

                    socketRef.current.emit("CSS_SYNC_CODE", {
                        code: cssCodeRef.current,
                        socketId,
                    });

                    socketRef.current.emit("JS_SYNC_CODE", {
                        code: JsCodeRef.current,
                        socketId,
                    });
                }
            );
        }
        
        init()
        console.log("start ")


        return () => {
            socketRef.current.disconnect();
            socketRef.current.off("JOINED");
            socketRef.current.off("DISCONNECTED");
        };
    }, []);



    return (
        <div className="mainWrap">

            <div className='colsWrapper'>
                <div className="editorWrap">
                    <div className='topWrapEditor'>
                        <div className='buttons'>
                            <EditorButton
                            backgroundColor={activeButton === "html" ? "green" : ""}
                            title="HTML"
                            onClick={() => {
                                onTabClick("html");
                            }}
                            />
                            <EditorButton
                            backgroundColor={activeButton === "css" ? "green" : ""}
                            title="CSS"
                            onClick={() => {
                                onTabClick("css");
                            }}
                            />
                            <EditorButton
                            backgroundColor={activeButton === "js" ? "green" : ""}
                            title="JavaScript"
                            onClick={() => {
                                onTabClick("js");
                            }}
                            />
                        </div>

                        <div className='editors'>
                            {
                                openedEditor === "html" ? (
                                    <EditorCom
                                    dbValue={code?.xml}
                                    language="xml"
                                    value={html}
                                    setEditorState={setHtml}
                                    socketRef={socketRef}
                                    roomId={roomId}
                                    onCodeChange={(code) => {
                                        htmlCodeRef.current = code;
                                    }}/>
                                ): openedEditor === "css" ? (
                                    <EditorCom
                                    dbValue={code?.css}
                                    language="css"
                                    value={css}
                                    setEditorState={setCss}
                                    socketRef={socketRef}
                                    roomId={roomId}
                                    onCodeChange={(code) => {
                                        cssCodeRef.current = code;
                                    }}/>
                                    ) : (
                                    <EditorCom
                                    dbValue={code?.js}
                                    language="javascript"
                                    displayName="JS"
                                    value={js}
                                    setEditorState={setJs}
                                    socketRef={socketRef}
                                    roomId={roomId}
                                    onCodeChange={(code) => {
                                        JsCodeRef.current = code;
                                    }}/>
                            )}
                            
                        </div>
                    </div>
                </div>
                
                <div className='iframe'>
                        <iframe
                            id="my_iframe"
                            srcDoc={srcDoc}
                            title="output"
                            sandbox="allow-scripts"
                            frameBorder="1"
                            width="100%"
                            height="100%"
                        />
                </div>
            </div>

        </div>
    );
};

export default EditorPage;