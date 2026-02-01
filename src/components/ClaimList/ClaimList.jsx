import { Link } from 'react-router';

const ClaimList = ({ claims, userRole }) => {
  if (!claims || claims.length === 0) {
    return <p>No claims found.</p>;
  }

  return (
    <div>
      <h2>{userRole === 'STAFF' ? 'All Claims' : 'My Claims'}</h2>
      <ul>
        {claims.map((claim) => (
          <li key={claim._id}>
            <h3>Item: {claim.itemId?.title || 'Unknown Item'}</h3>
            <p><strong>Status:</strong> {claim.status}</p>
            <p><strong>Submitted:</strong> {new Date(claim.createdAt).toLocaleDateString()}</p>
            {userRole === 'STAFF' && (
              <p><strong>Claimant:</strong> {claim.claimantId?.username}</p>
            )}
            <Link to={`/claims/${claim._id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClaimList;