import { Link } from 'react-router';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, handleSignOut } = useContext(UserContext);

  return (
    <>
      {/* Header with venue info and logo */}
      <header className="header">
        <div className="header-content">
          <div className="venue-info">
            <h1>Demo Venue</h1>
            <p>Lost & Found System</p>
          </div>
          <div className="logo-brand">
            <img src="/images/logo_white.png" alt="Claim & Regain" />
          </div>
        </div>
      </header>

      {/* Navigation bar */}
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            
            {!user ? (
              // Guest navigation
              <>
                <li><Link to="/founditems">Browse Found Items</Link></li>
                <li><Link to="/sign-in">Sign In</Link></li>
                <li><Link to="/sign-up">Sign Up</Link></li>
              </>
            ) : user.role === 'STAFF' ? (
              // Staff navigation
              <>
                <li><Link to="/staff/dashboard">Staff Dashboard</Link></li>
                <li><Link to="/founditems">Public View</Link></li>
                <li><Link to="/claims">Review Claims</Link></li>
                <li><Link to="/" onClick={handleSignOut}>Sign Out</Link></li>
              </>
            ) : (
              // Visitor navigation
              <>
                <li><Link to="/founditems">Browse Items</Link></li>
                <li><Link to="/claims">My Claims</Link></li>
                <li><Link to="/" onClick={handleSignOut}>Sign Out</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;