import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <main>
      <h1>Welcome to Claim & Regain, {user.username}!</h1>
      <p>Your role: <strong>{user.role}</strong></p>
      
      {user.role === 'STAFF' ? (
        <div>
          <h2>Staff Dashboard</h2>
          <p>As staff, you can:</p>
          <ul>
            <li><Link to='/founditems/new'>Log New Found Items</Link></li>
            <li><Link to='/claims'>Review Claims</Link></li>
            <li><Link to='/founditems'>View All Found Items</Link></li>
          </ul>
        </div>
      ) : (
        <div>
          <h2>Visitor Dashboard</h2>
          <p>As a visitor, you can:</p>
          <ul>
            <li><Link to='/founditems'>Browse Found Items</Link></li>
            <li><Link to='/claims'>View My Claims</Link></li>
          </ul>
        </div>
      )}
    </main>
  );
};

export default Dashboard;