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
import slackClient from './helpers/slack';

import SendMessage from './views/sendMessage';
import Home from './views/home';
import ScheduleMessage from './views/scheduleMessage';
import EditMessage from './views/editMessage';


function App() {
  const [token, setToken] = useState(localStorage['slackToken']);
  const [isLoading, setIsLoading] = useState(true);
  const [workspace, setWorkspace] = useState();
  const history = useHistory();
  const location = useLocation();

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
      // Initialize Slack client with the token
      await slackClient.init(token)

      // Update the states
      setWorkspace(await slackClient.loadWorkspace());
      setIsLoading(false);

      // If on the login page, redirect home
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
      <AppContext.Provider value={{ workspace, isLoading }}>
        <NavBar onLogout={logout}/>
        <div className="content">
          <Route exact path="/" component={Home} />
          <Route path="/sendMessage" component={SendMessage} />
          <Route path="/scheduleMessage" component={ScheduleMessage} />
          <Route path="/editMessage" component={EditMessage} />
          <Route path="/login" render={() => <TokenInput onSubmit={saveToken} />} />
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
