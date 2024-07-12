import React, {useRef, useEffect} from "react";
import './popupemailfunction.css';

const EmailFunction = ({closePopup, popupRef}) => {
    //closePopup (prop) is accepted and used in onClick event of X span
    return (
        <div ref={popupRef}>
            <div className="absolute-popup-window">
                <div className="side-by-side">
                    
                    <div className="side-by-side-arrangement custom-width-textinput-message">
                        <p>From:</p>
                        <input type="text" placeholder="Your email address"></input>
                    </div>

                    <span onClick={closePopup} className="close-emailfunction-popup">X</span>

                </div>
                <div className="side-by-side-arrangement">
                    <p>To: <span>info@rentaware.com</span></p>
                </div>
                <div className="title-message-popupfunction">
                    <p>Title:</p>
                    <input type="text" placeholder="Title of message" ></input>
                </div>
                <div className="title-message-popupfunction">
                    <p>Message:</p>
                    <textarea rows={12} cols={70} placeholder="Enter your message here..."></textarea>
                </div>
                <button>Send</button>
            </div>
        </div>
    )
}

export default EmailFunction; 