import './App.css';
import {useEffect, useState} from 'react';
import NavBar from './components/navbar/navbar';
import MessageSender from './components/messageSender/messageSender'
import {loadWorkspace} from './helpers/slackHelpers'

const { WebClient } = require('@slack/web-api');

function App() {
  const [token, setToken] = useState(localStorage['slackToken']);
  const [workspace, setWorkspace] = useState(); 

  useEffect(() => {
    // Save Slack token to local storage for future use
    if (token) {
      loadWorkspace(slackClient).then(workspace => {
        setWorkspace(workspace)
        localStorage.setItem('slackToken', token);
      }).catch(err => {
        // If token was invalid, reset the state
        setToken()
        alert(err)
      })
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
    setWorkspace();
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
      {workspace &&
        <div>
          <NavBar team={workspace.team} onLogout={logout}/>
          <MessageSender channels={workspace.channels} slackClient={slackClient}/>
        </div>
      }
    </div>
  );
}

export default App;
