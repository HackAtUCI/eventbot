import './App.css';
import {useEffect, useState} from 'react';
import NavBar from './components/navbar/navbar';

const { WebClient } = require('@slack/web-api');

function App() {
  const [token, setToken] = useState(localStorage['slackToken']);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('');
  const [channels, setChannels] = useState([]);
  const [team, setTeam] = useState();

  useEffect(() => {
    // Save Slack token to local storage for future use
    if (token) {
      localStorage.setItem('slackToken', token);
      loadWorkspaceData();
    } else {
      localStorage.removeItem('slackToken');
    }
  }, [token])

  // Create WebClient to interface with Slack API
  const slackClient = new WebClient(token);

  // Logout
  // Clear token and team information
  const logout = () => {
    setToken();
    setTeam();
  }

  const loadWorkspaceData = () => {
    // Verify that the token is valid before proceeding
    slackClient.auth.test()
      .catch(err => {
        alert(`Invalid token: '${token}'`)
        setToken()
        return Promise.reject()
      })
      .then(() => {
          // Load channels from Slack Workspace
          // Set selected channel to the first channel in the list
          slackClient.conversations.list()
          .then(result => {
            const channels = result.channels
              .map(channel => ({id: channel.id, name: channel.name}))
              .sort((c1, c2) => (c1.name > c2.name) ? 1 : -1);
            setChannels(channels);
            setChannel(channels[0].id);
          })

          // Load team information
          slackClient.team.info()
            .then(result => {
              setTeam({name: result.team.name, icon: result.team.icon.image_230});
            });
      });
  }

  const saveToken = event => {
    event.preventDefault();
    setToken(event.target[0].value);
  }

  const sendMessage = event => {
    event.preventDefault();

    slackClient.chat.postMessage({
      text: message,
      channel: channel,
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
      {team &&
        <div>
          <NavBar team={team} onLogout={logout}/>
          <h1>Send message to #bot-playground</h1>
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
      }
    </div>
  );
}

export default App;
