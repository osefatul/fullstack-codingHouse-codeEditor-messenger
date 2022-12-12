import React from "react";

const EditorButton = ({ title, backgroundColor, onClick }) => {
    return (
    <div>
        <button
        style={{
            maxWidth: "120px",
            minWidth: "50px",
            height: "25px",
            marginRight: "5px",
            borderRadius:"2px",
            backgroundColor: backgroundColor,
        }}
        onClick={onClick}
        >
        {title}
        </button>
    </div>
    );
};

export default EditorButton;