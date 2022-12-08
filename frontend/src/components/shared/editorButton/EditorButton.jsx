import React from "react";

const EditorButton = ({ title, backgroundColor, onClick }) => {
    return (
    <div>
        <button
        style={{
            maxWidth: "140px",
            minWidth: "80px",
            height: "30px",
            marginRight: "5px",
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