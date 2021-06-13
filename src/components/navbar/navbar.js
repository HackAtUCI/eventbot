import './navbar.css';

function NavBar(props) {
  const {
      team, 
      onLogout
  } = props;

  return (
    <div>
        {team.name}
        <button onClick={onLogout}>Log Out</button>
    </div>
    
  );
}

export default NavBar;
