import React from 'react'
import "./codeEditor.css"


function Preview({srcDoc}) {


return (
    <div className="iframe">
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
)
}

export default Preview