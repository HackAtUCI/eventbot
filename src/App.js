import './App.css';
import {useEffect, useState} from 'react';
import NavBar from './components/navbar/navbar';
import MessageSender from './components/messageSender/messageSender'

const { WebClient } = require('@slack/web-api');

function App() {
  const [token, setToken] = useState(localStorage['slackToken']);
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
          <MessageSender channels={channels} slackClient={slackClient}/>
        </div>
      }
    </div>
  );
}

export default App;
