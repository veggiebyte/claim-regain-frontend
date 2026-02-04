import { Link } from 'react-router';
import { useState } from 'react';

const ClaimList = ({ claims, userRole }) => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (!claims || claims.length === 0) {
    return (
      <div className="page-content">
        <div className="browse-header">
          <div className="browse-title-container large-image">
            <div className="browse-image">
              <img src="/images/lost_keys.jpg" alt="Lost Keys" />
            </div>
            <div className="browse-title-text">
              <div className="browse-title">
                <div className="browse-icon">📋</div>
                <h1>{userRole === 'STAFF' ? 'Review Claims' : 'My Claims'}</h1>
              </div>
              <p>
                {userRole === 'STAFF'
                  ? 'Review and manage all submitted claims. Verify answers and approve or deny claims.'
                  : "Below are claims you've submitted. Check the status to see if your claim was approved."}
              </p>
            </div>
          </div>
        </div>

        <div className="card text-center">
          <h2>No Claims Found</h2>
          <p>{userRole === 'STAFF' ? 'No claims have been submitted yet.' : "You haven't submitted any claims yet."}</p>
          {userRole !== 'STAFF' && (
            <Link to="/founditems" className="btn-primary btn-large">
              Browse Found Items
            </Link>
          )}
        </div>
      </div>
    );
  }

  const filteredClaims = claims.filter(claim => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const itemName = (claim.itemId?.publicDescription || claim.itemId?.title || '').toLowerCase();
    const claimant = (claim.claimantId?.username || '').toLowerCase();
    return itemName.includes(query) || claimant.includes(query);
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'item':
        aVal = (a.itemId?.publicDescription || a.itemId?.title || '').toLowerCase();
        bVal = (b.itemId?.publicDescription || b.itemId?.title || '').toLowerCase();
        break;
      case 'claimant':
        aVal = (a.claimantId?.username || '').toLowerCase();
        bVal = (b.claimantId?.username || '').toLowerCase();
        break;
      case 'status':
        aVal = a.status.toLowerCase();
        bVal = b.status.toLowerCase();
        break;
      case 'createdAt':
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="page-content">
      <div className="browse-header">
        <div className="browse-title-container large-image">
          <div className="browse-image">
            <img src="/images/lost_keys.jpg" alt="Lost Keys" />
          </div>
          <div className="browse-title-text">
            <div className="browse-title">
              <div className="browse-icon">📋</div>
              <h1>{userRole === 'STAFF' ? 'Review Claims' : 'My Claims'}</h1>
            </div>
            <p>
              {userRole === 'STAFF'
                ? 'Review and manage all submitted claims. Verify answers and approve or deny claims. Use the search below to find a specific claim by item name or claimant.'
                : "Below are claims you've submitted. Check the status to see if your claim was approved."}
            </p>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search by item name or claimant..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-container actions-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('item')} className="sortable">
                Item {sortBy === 'item' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              {userRole === 'STAFF' && (
                <th onClick={() => handleSort('claimant')} className="sortable">
                  Claimant {sortBy === 'claimant' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              )}
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('createdAt')} className="sortable">
                Submitted {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedClaims.map((claim) => (
              <tr key={claim._id}>
                <td>{claim.itemId?.publicDescription || claim.itemId?.title || 'Unknown Item'}</td>
                {userRole === 'STAFF' && (
                  <td>{claim.claimantId?.username}</td>
                )}
                <td>{claim.status}</td>
                <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                <td>
                  {userRole === 'STAFF' ? (
                    <Link to={`/claims/${claim._id}`}>Review</Link>
                  ) : (
                    <span>{claim.status === 'PENDING' ? 'Pending review' : claim.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClaimList;