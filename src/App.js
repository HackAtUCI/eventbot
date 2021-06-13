import './App.css';
import {useEffect, useState} from 'react';

const { WebClient } = require('@slack/web-api');

function App() {
  const [token, setToken] = useState(localStorage.getItem('slackToken'));
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Save Slack token to local storage for future use
    localStorage.setItem('slackToken', token);
  }, [token])

  // Create WebClient to interface with Slack API
  const slackClient = new WebClient(token);

  const saveToken = event => {
    event.preventDefault();
    setToken(event.target[0].value);
  }

  const sendMessage = event => {
    event.preventDefault();

    slackClient.chat.postMessage({
      text: message,
      channel: "C01AU7UCNGN",
    })

    setMessage('');
  }

  return (
    <div className="App">
      {!token &&
        <div>
          <h1>Enter Slack Token</h1>
          <form onSubmit={saveToken}>
            <input type="password" />
            <input type="submit" />
          </form>
        </div>
      }
      {token &&
        <div>
          <h1>Send message to #bot-playground</h1>
          <form onSubmit={sendMessage}>
            <input type="text" value={message} onChange={event => {setMessage(event.target.value)}} />
            <input type="submit" />
          </form>
        </div>
      }
    </div>
  );
}

export default App;
