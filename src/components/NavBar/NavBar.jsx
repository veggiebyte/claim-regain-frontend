// src/components/NavBar/NavBar.jsx
import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, handleSignOut } = useContext(UserContext);

  return (
    <nav>
      {user ? (
        <ul>
          <li><Link to='/'>HOME</Link></li>
          <li><Link to='/hoots'>HOOTS</Link></li>
          {/* Add the NEW HOOT link */}
          <li><Link to='/hoots/new'>NEW HOOT</Link></li>
          <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
      ) : (
        <ul>
          <li><Link to='/'>HOME</Link></li>
          <li><Link to='/sign-in'>SIGN IN</Link></li>
          <li><Link to='/sign-up'>SIGN UP</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;