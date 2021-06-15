import MessageInput from '../components/messageInput/messageInput'
import AppContext from '../AppContext';
import {useContext} from 'react';

function SendMessage() {
    const { slackClient } = useContext(AppContext);

    const sendMessage = (message, channel) => {
        slackClient.postMessage(message, channel);
    }

    return (
        <div>
            <h1>Send message</h1>
            <MessageInput submitAction={sendMessage}/>
        </div>
    );
}

export default SendMessage;
