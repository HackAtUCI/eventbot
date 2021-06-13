import './App.css';
import {useEffect, useState} from 'react';
import NavBar from './components/navbar/navbar';
import MessageSender from './components/messageSender/messageSender'
import TokenInput from './components/tokenInput/tokenInput';
import {loadWorkspace, validateToken} from './helpers/slackHelpers'

const { WebClient } = require('@slack/web-api');

function App() {
  const [token, setToken] = useState(localStorage['slackToken']);
  const [workspace, setWorkspace] = useState(); 

  useEffect(() => {
    if (token) {
      // Save Slack token to local storage for future use
      localStorage.setItem('slackToken', token);

      // Login with new token
      login()
    } else {
      localStorage.removeItem('slackToken');
    }
  }, [token])

  // Create WebClient to interface with Slack API
  const slackClient = new WebClient(token);

  // Logout
  // Clear token and workspace information
  const logout = () => {
    setToken();
    setWorkspace();
  }

  // Login
  // Validate token and load workspace information
  // If token is invalid, an alert will be shown
  const login = () => {
    validateToken(slackClient).then(() => {
      loadWorkspace(slackClient).then(workspace => {
        setWorkspace(workspace)
      })
    }).catch(err => {
      // Token was invalid, reset and display alert
      setToken()
      alert(err)
    })
  }

  const saveToken = event => {
    event.preventDefault();
    setToken(event.target[0].value);
  }

  return (
    <div className="App">
      {!token &&
        <TokenInput onSubmit={saveToken} />
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
