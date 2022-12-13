import React, { useEffect, useRef, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/the-matrix.css';
import 'codemirror/theme/night.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import { Controlled as ControlledEditorComponent } from 'react-codemirror2';
import "./codeEditor.css"
import {getCodes, updateCSSCode, updateJSCode, updateXMLCode } from '../../../http';


const EditorComp = ({ language, value, setEditorState, socketRef, roomId, onCodeChange  }) => {

    const editorRef = useRef(null);
    const [theme, setTheme] = useState("dracula")
    // const { id: roomId } = useParams();
    const themeArray = ['dracula', 'monokai', 'mdn-like', 'the-matrix', 'night']


    const handleChange = (editor, data, value,) => {

        async function init() {
            onCodeChange(value);
            setEditorState(value);

            if(language === "xml"){

                console.log("this is xml:", language)
                await socketRef.current.emit("XML_CODE_CHANGE", {
                roomId,
                code:value
            });

            await updateXMLCode({xml:value, roomId })
            }

            else if(language === "css"){
                console.log("this is css:", language)
                await socketRef.current.emit("CSS_CODE_CHANGE", {
                    roomId,
                    code:value
                });

                await updateCSSCode({css:value, roomId })

            }

            else {
                console.log("this is js:", language)
                await socketRef.current.emit("JS_CODE_CHANGE", {
                    roomId,
                    code:value
                });
                await updateJSCode({js:value, roomId })
            }
        }
        init();
    }





    useEffect(()=>{
        async function init() {
            const {data} = await getCodes(roomId)
            console.log(data.code)
            // if(language === "xml"){
                
            //     // onCodeChange(value);
            //     // setEditorState(value);
            // }

            // else if(language === "css"){
            //     const {data} = await getCodes(roomId)
            // }

            // else {
            //     const {data} = await getCodes(roomId)
            // }
        }
        init();
    },[])

    useEffect(() => {
        async function init() {
            // console.log(value)
            onCodeChange(value);
            setEditorState(value);

            if( value && language === "xml"){
                console.log("this is xml:", language)
                await socketRef.current.emit("XML_CODE_CHANGE", {
                    roomId,
                    code:value
            });
            }

            else if(value && language === "css"){
                console.log("this is css:", language)
                await socketRef?.current?.emit("CSS_CODE_CHANGE", {
                    roomId,
                    code:value
                });
            }

            else if(value && language === "js") {
                console.log("this is js:", language)
                await socketRef?.current?.emit("JS_CODE_CHANGE", {
                    roomId,
                    code:value
                });
            }
        }

        init();

    }, [value, language, onCodeChange, setEditorState]);



    useEffect(() => {
        if( socketRef?.current && language === "xml"){
            socketRef?.current.on("XML_CODE_CHANGE", ({ xml }) => {
                console.log("receiving xml", xml)

                if (xml)  {
                    // setCode(serverCode);
                    // editorRef.current.value = xml
                    onCodeChange(xml);
                    setEditorState(xml)
                }
            });
        }


        else if( socketRef.current && language === "css"){
            socketRef?.current?.on("CSS_CODE_CHANGE", ({ css }) => {
                console.log(css)

                if (css)  {
                    // editorRef.current.value = css
                    onCodeChange(css);
                    setEditorState(css)
                }
            });
        }

        else{
            socketRef?.current?.on("JS_CODE_CHANGE", 
            ({ js }) => {
                console.log(js)

                if (js)  {
                    // editorRef.current.value = js
                    onCodeChange(js);
                    setEditorState(js)
                }
            });
        }



        return () => {
            if(language === "xml"){
                socketRef.current.off("XML_CODE_CHANGE");
            }
            else if(language === "css"){
                socketRef.current.off("CSS_CODE_CHANGE");

            }
            else{
                socketRef.current.off("JS_CODE_CHANGE");
            }
        };

    }, [socketRef.current, language, setEditorState]);

    





return (
<div className="editorContainer">
    <div className='themes'>
        <label for="cars">Choose a theme: </label> 
        <select name="theme" onChange={(el) => {
            setTheme(el.target.value)
        }}>
            {
            themeArray.map( theme => (
                <option option key={theme + 234} value={theme}>{theme}</option>
            ))
            }
        </select>
    </div>


    <ControlledEditorComponent
        onBeforeChange={handleChange}
        ref={editorRef}
        value= {value}
        className="code-mirror-wrapper"
        options={{
            lineWrapping: true,
            lint: true,
            mode: language,
            lineNumbers: true,
            theme: theme,
            autoCloseTags: true,
            autoCloseBrackets: true, 
        }}
    />


</div>
)
}

export default EditorComp