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
          <h1 className="venue-title">Demo Venue</h1>
          <p className="powered-by">Powered by</p>
          <div className="logo-brand">
            <img src="/images/logo_white.png" alt="Claim & Regain" />
          </div>
        </div>
      </header>

      {/* Navigation bar */}
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-links">
            <li>
              <Link to="/">
                <span>🏠</span> Home
              </Link>
            </li>
            
            {!user ? (
              // Guest navigation
              <>
                <li>
                  <Link to="/founditems">
                    <span>🔍</span> Browse Found Items
                  </Link>
                </li>
                <li>
                  <Link to="/sign-in">
                    <span>🔑</span> Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/sign-up">
                    <span>📝</span> Sign Up
                  </Link>
                </li>
              </>
            ) : user.role === 'STAFF' ? (
              // Staff navigation
              <>
                <li>
                  <Link to="/staff/dashboard">
                    <span>📋</span> Staff Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/founditems">
                    <span>👁️</span> Public View
                  </Link>
                </li>
                <li>
                  <Link to="/claims">
                    <span>✓</span> Review Claims
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={handleSignOut}>
                    <span>🚪</span> Sign Out
                  </Link>
                </li>
              </>
            ) : (
              // Visitor navigation
              <>
                <li>
                  <Link to="/founditems">
                    <span>🔍</span> Browse Items
                  </Link>
                </li>
                <li>
                  <Link to="/claims">
                    <span>📝</span> My Claims
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={handleSignOut}>
                    <span>🚪</span> Sign Out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;