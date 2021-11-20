import React from "react";
import MessageInput from '../components/messageInput/messageInput'
import MarkdownGuide from "../components/markdownGuide/markdownGuide";

import slackClient from '../helpers/slack';

function SendMessage() {
    const sendMessage = (message, channel) => {
        slackClient.postMessage(message, channel);
    }

    return (
        <div>
            <h1>Send message</h1>
            <MessageInput submitAction={sendMessage}/>
            <MarkdownGuide/>
        </div>
    );
}

export default SendMessage;
