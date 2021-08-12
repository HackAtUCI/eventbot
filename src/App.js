import './App.css';

import { useCallback, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AppContext from "./AppContext";
import NavBar from "./components/navbar/navbar";
import TokenInput from "./components/tokenInput/tokenInput";
import slackClient from "./helpers/slack";
import EditMessage from "./views/editMessage";
import Home from "./views/home";
import ScheduleMessage from "./views/scheduleMessage";
import SendMessage from "./views/sendMessage";

function App() {
  // Initially not restricted to private routes
  const [loggedIn, setLoggedIn] = useState(null);
  const [workspace, setWorkspace] = useState();

  // Validate token and load workspace information
  // Returns whether or not the token was validated
  const login = useCallback(async (token) => {
    try {
      // Initialize Slack client with the token
      await slackClient.init(token);

      setWorkspace(await slackClient.loadWorkspace());
      setLoggedIn(true);
      // Save the token for future sessions
      localStorage.setItem("slackToken", token);
      return true;
    } catch (err) {
      setLoggedIn(false);
      return false;
    }
  }, []);

  // when first loading, log in with the saved token, if any
  useEffect(() => {
    const token = localStorage["slackToken"];
    if (token) {
      login(token);
    } else {
      setLoggedIn(false);
    }
  }, [login]);

  // Logout
  // Clear token and workspace information
  const logout = () => {
    localStorage.removeItem("slackToken");
    // Log out before removing workspace
    setLoggedIn(false);
    setWorkspace();
  };

  return (
    <div className="App">
      <AppContext.Provider value={{ workspace }}>
        <NavBar onLogout={logout} />
        <div className="content">
          <Switch>
            <ProtectedRoute loggedIn={loggedIn} exact path="/" component={Home} />
            <ProtectedRoute loggedIn={loggedIn} path="/sendMessage">
              <SendMessage />
            </ProtectedRoute>
            <ProtectedRoute loggedIn={loggedIn} path="/scheduleMessage">
              <ScheduleMessage />
            </ProtectedRoute>
            <ProtectedRoute loggedIn={loggedIn} path="/editMessage">
              <EditMessage />
            </ProtectedRoute>
            <Route
              path="/login"
              render={() => (loggedIn ? <Redirect to="/" /> : <TokenInput login={login} />)}
            />
          </Switch>
        </div>
      </AppContext.Provider>
    </div>
  );
}

function ProtectedRoute({ loggedIn, children, component, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        // redirect if explicitly not logged in
        if (loggedIn === false) {
          return <Redirect to="/login" />;
        }
        // React expects components to be capitalized
        const Component = component;
        return children || <Component /> || render();
      }}
    />
  );
}

export default App;
