import './navbar.css';

import {NavLink} from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../AppContext';

function NavBar({ onLogout }) {
  const { workspace } = useContext(AppContext)

  return (
    <div className="nav-bar">
        <h1>EventBot</h1>
        {workspace && 
            <div>
                <div className="workspace">
                    <h3>{workspace.team.name}</h3>
                    <button onClick={onLogout}>Log Out</button>
                </div>
                <ul>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/sendMessage'>Send Message</NavLink></li>
                    <li><NavLink to='/scheduleMessage'>Schedule Message</NavLink></li>
                    <li><NavLink to='/editMessage'>Edit Message</NavLink></li>
                </ul>
            </div>
        }
    </div>
  );
}

export default NavBar;
