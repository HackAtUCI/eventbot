import './App.css';
import {
  Route,
  useHistory,
  useLocation
} from 'react-router-dom';
import {useEffect, useState} from 'react';
import NavBar from './components/navbar/navbar';
import AppContext from './AppContext';
import TokenInput from './components/tokenInput/tokenInput';
import SlackClient from './helpers/slack';
import SendMessage from './views/sendMessage';
import Home from './views/home';
import ScheduleMessage from './views/scheduleMessage';

const { WebClient } = require('@slack/web-api');

function App() {
  const [token, setToken] = useState(localStorage['slackToken']);
  const [workspace, setWorkspace] = useState(); 
  const history = useHistory();
  const location = useLocation();
  
  // Create WebClient to interface with Slack API
  const slackClient = new SlackClient(new WebClient(token)); 

  useEffect(() => {
    if (token) {
      // Save Slack token to local storage for future use
      localStorage.setItem('slackToken', token);

      // Login with new token
      login()
    } else {
      localStorage.removeItem('slackToken');
      history.push("/login");
    }
  }, [token])

  // Logout
  // Clear token and workspace information
  const logout = () => {
    setToken();
    setWorkspace();
  }

  // Login
  // Validate token and load workspace information
  // If token is invalid, an alert will be shown
  const login = async () => {
    try {
      await slackClient.validateToken();
      setWorkspace(await slackClient.loadWorkspace());
      if (location.pathname === '/login') {
        history.push("/")
      }
    } catch(err) {
      // Token was invalid, reset and display alert
      setToken()
      alert(err)
    }
  }

  const saveToken = event => {
    event.preventDefault();
    setToken(event.target[0].value);
    event.target[0].value = '';
  }

  return (
    <div className="App">
      <AppContext.Provider value={{slackClient, workspace}}>
        <NavBar onLogout={logout}/>
        <div className="content">
          <Route exact path="/" component={Home} />
          <Route path="/sendMessage" component={SendMessage} />
          <Route path="/scheduleMessage" component={ScheduleMessage} />
          <Route path="/login" render={() => <TokenInput onSubmit={saveToken} />} />
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
