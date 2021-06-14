import './navbar.css';

import {NavLink} from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../AppContext';

function NavBar(props) {
  const { onLogout } = props;
  const { workspace } = useContext(AppContext)

  return (
    <div>
        {workspace && 
            <div>
                {workspace.team.name}
                <button onClick={onLogout}>Log Out</button>
                <ul>
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/sendMessage'>Send Message</NavLink></li>
                </ul>
            </div>
        }
    </div>
  );
}

export default NavBar;
