import './messageSender.css';

import {postMessage} from '../../helpers/slackHelpers';
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
    postMessage(slackClient, message, channel);
    
    // Reset the textarea
    messageTextField.current.value = '';
  }

  return (
    <div>
        <form onSubmit={sendMessage}>
        <select value={channel} onChange={event => {setChannel(event.target.value)}}>
            {channels && channels.map((channel, i) =>
            <option key={i} value={channel.id}>{channel.name}</option>
            )}
        </select>
        <textarea type="text" ref={messageTextField} />
        <input type="submit" />
        </form>
    </div>
    
  );
}

export default MessageSender;
