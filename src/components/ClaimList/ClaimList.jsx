import { Link } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as claimService from '../../services/claimService';

const ClaimList = () => {
  const { user } = useContext(UserContext);
  const [claims, setClaims] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      if (user) {
        const data = await claimService.index();
        setClaims(data);
      }
    };
    fetchClaims();
  }, [user]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);

      // sensible defaults
      if (field === 'action') setSortOrder('asc'); // pending-first feels natural
      else setSortOrder('desc');
    }
  };

  // Action label displayed in Actions column
  const getActionLabel = (claim) => {
    if (user.role === 'STAFF') {
      return claim.status === 'PENDING' ? 'Review' : 'View/Edit';
    }
    // Visitor labels
    if (claim.status === 'PENDING') return 'Edit Claim';
    if (claim.status === 'APPROVED') return 'See Pickup Details';
    if (claim.status === 'DENIED') return 'View Details';
    return 'View';
  };

  // Sorting priority for Actions: pending first (asc), pending last (desc)
  const getActionPriority = (claim) => {
    // lower number = comes first
    if (claim.status === 'PENDING') return 0;
    return 1;
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
                <h1>{user.role === 'STAFF' ? 'Review Claims' : 'My Claims'}</h1>
              </div>
              <p>
                {user.role === 'STAFF'
                  ? 'Review and manage all submitted claims. Verify answers and approve or deny claims.'
                  : "Below are claims you've submitted. Check the status to see if your claim was approved."}
              </p>
            </div>
          </div>
        </div>

        <div className="card text-center">
          <h2>No Claims Found</h2>
          <p>{user.role === 'STAFF' ? 'No claims have been submitted yet.' : "You haven't submitted any claims yet."}</p>
          {user.role !== 'STAFF' && (
            <Link to="/founditems" className="btn-primary btn-large">
              Browse Found Items
            </Link>
          )}
        </div>
      </div>
    );
  }

  const filteredClaims = claims.filter((claim) => {
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
        aVal = (a.status || '').toLowerCase();
        bVal = (b.status || '').toLowerCase();
        break;

      case 'createdAt':
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
        break;

      case 'action': {
        // 1) pending priority (pending first on asc, last on desc)
        const aPri = getActionPriority(a);
        const bPri = getActionPriority(b);
        if (aPri !== bPri) {
          return sortOrder === 'asc' ? aPri - bPri : bPri - aPri;
        }

        // 2) tie-breaker: alphabetic action label
        aVal = getActionLabel(a).toLowerCase();
        bVal = getActionLabel(b).toLowerCase();
        break;
      }

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
              <h1>{user.role === 'STAFF' ? 'Review Claims' : 'My Claims'}</h1>
            </div>
            <p>
              {user.role === 'STAFF'
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

              {user.role === 'STAFF' && (
                <th onClick={() => handleSort('claimant')} className="sortable">
                  Claimant {sortBy === 'claimant' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              )}

              <th onClick={() => handleSort('createdAt')} className="sortable">
                Submitted {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>

              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>

              <th onClick={() => handleSort('action')} className="sortable">
                Actions {sortBy === 'action' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedClaims.map((claim) => (
              <tr key={claim._id}>
                {/* Item name - NOT clickable */}
                <td className="item-name">
                  {claim.itemId?.publicDescription || claim.itemId?.title || 'Unknown Item'}
                </td>

                {user.role === 'STAFF' && <td>{claim.claimantId?.username}</td>}

                <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                <td>{claim.status}</td>

                <td>
                  {/* Both STAFF and VISITOR can click their respective actions */}
                  <Link to={`/claims/${claim._id}`} className="action-link">
                    {getActionLabel(claim)}
                  </Link>
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