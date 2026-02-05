import { Link } from 'react-router';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Modal from '../Modal/Modal';
import * as claimService from '../../services/claimService';
import * as foundItemService from '../../services/foundItemService';

const FoundItemList = () => {
  const { user } = useContext(UserContext);
  const [foundItems, setFoundItems] = useState([]);
  const [sortBy, setSortBy] = useState('dateFound');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userClaims, setUserClaims] = useState([]);

  // Fetch found items
  useEffect(() => {
    const fetchFoundItems = async () => {
      const data = await foundItemService.index();
      setFoundItems(data);
    };
    fetchFoundItems();
  }, []);

  // Fetch user's claims if logged in
  useEffect(() => {
    const fetchUserClaims = async () => {
      if (user) {
        try {
          const claims = await claimService.index();
          setUserClaims(claims || []);
        } catch (error) {
          console.log('Could not fetch claims');
          setUserClaims([]);
        }
      }
    };
    fetchUserClaims();
  }, [user]);

  // Check if user already has a claim for this item
  const getUserClaimForItem = (itemId) => {
    if (!Array.isArray(userClaims)) return null;
    return userClaims.find(claim => 
      claim.itemId && 
      (claim.itemId._id === itemId || claim.itemId === itemId)
    );
  };

  if (!foundItems || foundItems.length === 0) {
    return (
      <div className="page-content">
        <div className="card text-center">
          <h2>No Items Found</h2>
          <p>There are currently no items in the lost and found system.</p>
        </div>
      </div>
    );
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleViewClaim = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Filter: show FOUND and CLAIMED items, hide DONATED and DISPOSED
  const filteredItems = foundItems.filter(item => {
    // Show FOUND and CLAIMED items (staff will handle hiding picked-up items from backend)
    // Hide DONATED and DISPOSED
    if (item.status === 'DONATED' || item.status === 'DISPOSED') return false;
    
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.publicDescription.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.locationFound.toLowerCase().includes(query) ||
      (item.color && item.color.toLowerCase().includes(query))
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'dateFound':
        aVal = new Date(a.dateFound);
        bVal = new Date(b.dateFound);
        break;
      case 'category':
        aVal = a.category.toLowerCase();
        bVal = b.category.toLowerCase();
        break;
      case 'location':
        aVal = a.locationFound.toLowerCase();
        bVal = b.locationFound.toLowerCase();
        break;
      case 'item':
        aVal = a.publicDescription.toLowerCase();
        bVal = b.publicDescription.toLowerCase();
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
        <div className="browse-title-container small-image">
          <div className="browse-image">
            <img src="/images/wheres_my_stuff.png" alt="Where's my stuff" />
          </div>
          <div className="browse-title-text">
            <div className="browse-title">
              <div className="browse-icon">🔍</div>
              <h1>Browse Found Items</h1>
            </div>
            <p>Lost something? Browse our found items below. Think you see yours? Click 'View/Claim' to get started.</p>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search by item, category, or location..."
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
              Found Item {sortBy === 'item' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('dateFound')} className="sortable">
              Date Found {sortBy === 'dateFound' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('category')} className="sortable">
              Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('location')} className="sortable">
              Location {sortBy === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item._id}>
              <td className="item-name">{item.publicDescription}</td>
              <td>{new Date(item.dateFound).toLocaleDateString()}</td>
              <td>{item.category}</td>
              <td>{item.locationFound}</td>
              <td>
                <button onClick={() => handleViewClaim(item)} className="view-link">
                  View/Claim →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedItem && (
          <div>
            <h2>{selectedItem.publicDescription}</h2>
            <p><span className="label">Category:</span> {selectedItem.category}</p>
            <p><span className="label">Location Found:</span> {selectedItem.locationFound}</p>
            <p><span className="label">Date Found:</span> {new Date(selectedItem.dateFound).toLocaleDateString()}</p>

            {!user ? (
              <div>
                <p>You need to sign in or create an account to file a claim for this item.</p>
                <div className="cta-buttons mt-20">
                  <Link 
                    to="/sign-in" 
                    onClick={closeModal} 
                    className="btn-primary btn-large"
                    state={{ from: '/founditems' }}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/sign-up" 
                    onClick={closeModal} 
                    className="btn-secondary btn-large"
                    state={{ from: '/founditems' }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (() => {
              // Staff should never see "you already claimed" - they don't claim items
              if (user.role === 'STAFF') {
                return (
                  <div>
                    <p>As staff, you can view all claims for this item from the Staff Dashboard.</p>
                    <div className="cta-buttons mt-20">
                      <Link to="/staff/dashboard" onClick={closeModal} className="btn-primary btn-large">
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                );
              }

              const existingClaim = getUserClaimForItem(selectedItem._id);
              
              if (existingClaim) {
                return (
                  <div>
                    <div className={`status-banner ${existingClaim.status.toLowerCase()}`}>
                      <h3>You Already Filed a Claim</h3>
                      <p>Status: {existingClaim.status}</p>
                    </div>
                    
                    {existingClaim.status === 'PENDING' && (
                      <p>Your claim is being reviewed by staff. Check your claims page for updates.</p>
                    )}
                    
                    {existingClaim.status === 'APPROVED' && (
                      <p>Your claim was approved! Visit your claims page to see pickup instructions.</p>
                    )}
                    
                    {existingClaim.status === 'DENIED' && (
                      <p>Your claim was not approved. Visit your claims page to see the reason.</p>
                    )}
                    
                    <div className="cta-buttons mt-20">
                      <Link to="/claims" onClick={closeModal} className="btn-primary btn-large">
                        View My Claims
                      </Link>
                    </div>
                  </div>
                );
              }
              
              return (
                <div>
                  <p>Think this is yours? Click below to file a claim and answer verification questions to help us confirm ownership.</p>
                  <div className="cta-buttons mt-20">
                    <Link to={`/founditems/${selectedItem._id}/claim`} onClick={closeModal} className="btn-primary btn-large">
                      File a Claim
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FoundItemList;