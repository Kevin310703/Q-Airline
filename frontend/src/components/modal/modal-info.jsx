import React from "react";

const Modal = ({ message, onClose }) => {
    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <p>{message}</p>
                <button className="btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
