import './navbar.css';

import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import {NavLink} from 'react-router-dom';
import { useContext, useState } from 'react';
import AppContext from '../../AppContext';
import { IconContext } from 'react-icons';

function NavBar({ onLogout }) {
  const { workspace } = useContext(AppContext)
  const [sidebar, setSidebar] = useState(true);
  const toggleSidebar = () => setSidebar(!sidebar);

  return (
      <IconContext.Provider value={{ color: '#fff' }}>
          {workspace &&
              <div>
                  <div className='navbar'>
                      <NavLink to='#' className='nav-menu-bars'>
                          <FaIcons.FaBars onClick={toggleSidebar}/>
                      </NavLink>
                  </div>
                  <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                      <ul className='nav-menu-items'>
                          <div className='nav-menu-x' onClick={toggleSidebar}>
                              <AiIcons.AiOutlineClose/>
                              </div>
                              <div>
                                <h3>{workspace.team.name}</h3>
                              <button onClick={() => {onLogout(); toggleSidebar()}}>Log Out</button>
                          </div>
                      <li><NavLink to='/'>Home</NavLink></li>
                      <li><NavLink to='/sendMessage'>Send Message</NavLink></li>
                      <li><NavLink to='/scheduleMessage'>Schedule Message</NavLink></li>
                      <li><NavLink to='/editMessage'>Edit Message</NavLink></li>
                      </ul>
                  </nav>
              </div>
          }
      </IconContext.Provider>
  );
}

export default NavBar;
