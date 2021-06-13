import './messageSender.css';

import {useState} from 'react';

function MessageSender(props) {
  const { channels, slackClient } = props;

  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState(channels[0].id);

  const sendMessage = event => {
    event.preventDefault();
    slackClient.chat.postMessage({ text: message, channel: channel })
        .catch((err) => {
            alert('Unable to post message. Review the error message in the console.')
            console.error(err, {channel});
        })
    setMessage('');
  }

  return (
    <div>
        <h1>Send message</h1>
          <form onSubmit={sendMessage}>
            <select value={channel} onChange={event => {setChannel(event.target.value)}}>
              {channels.map((channel, i) =>
                <option key={i} value={channel.id}>{channel.name}</option>
              )}
            </select>
            <input type="text" value={message} onChange={event => {setMessage(event.target.value)}} />
            <input type="submit" />
          </form>
    </div>
    
  );
}

export default MessageSender;
