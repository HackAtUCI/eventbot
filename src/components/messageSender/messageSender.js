import './messageSender.css';

import AppContext from '../../AppContext';
import {useState, useRef, useContext} from 'react';

function MessageSender() {
  const { workspace: {channels} = {}, slackClient } = useContext(AppContext);

  const messageTextField = useRef(null);
  const [channel, setChannel] = useState(channels && channels[0].id);

  const sendMessage = event => {
    event.preventDefault();

    // Get message from textarea
    // Return early if message is blank
    let message = messageTextField.current.value;
    if (!message) { return }

    // Post the message to slack
    slackClient.postMessage(message, channel);
    
    // Reset the textarea
    messageTextField.current.value = '';
  }

  return (
    <div className="message-sender">
        <form onSubmit={sendMessage}>
            <textarea type="text" ref={messageTextField} />
            <div>
                <select value={channel} onChange={event => {setChannel(event.target.value)}}>
                    {channels && channels.map((channel, i) =>
                    <option key={i} value={channel.id}>{channel.name}</option>
                    )}
                </select>
                <input type="submit" />
            </div>
        </form>
    </div>
    
  );
}

export default MessageSender;
