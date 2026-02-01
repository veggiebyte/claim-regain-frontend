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
          <li><Link to='/founditems'>FOUND ITEMS</Link></li>
          {user.role === 'STAFF' && (
            <li><Link to='/founditems/new'>LOG ITEM</Link></li>
          )}
          <li><Link to='/claims'>CLAIMS</Link></li>
          <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
      ) : (
        <ul>
          <li><Link to='/'>HOME</Link></li>
          <li><Link to='/founditems'>FOUND ITEMS</Link></li>
          <li><Link to='/sign-in'>SIGN IN</Link></li>
          <li><Link to='/sign-up'>SIGN UP</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;