import { Link } from 'react-router';
import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Modal from '../Modal/Modal';

const FoundItemList = ({ foundItems }) => {
  const { user } = useContext(UserContext);
  const [sortBy, setSortBy] = useState('dateFound');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const filteredItems = foundItems.filter(item => {
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
              <td><strong>{item.publicDescription}</strong></td>
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
            <p><strong>Category:</strong> {selectedItem.category}</p>
            <p><strong>Color:</strong> {selectedItem.color}</p>
            <p><strong>Location Found:</strong> {selectedItem.locationFound}</p>
            <p><strong>Date Found:</strong> {new Date(selectedItem.dateFound).toLocaleDateString()}</p>

            {!user ? (
              <div>
                <p>You need to sign in or create an account to file a claim for this item.</p>
                <div className="cta-buttons mt-20">
                  <Link to="/sign-in" onClick={closeModal} className="btn-primary btn-large">
                    Sign In
                  </Link>
                  <Link to="/sign-up" onClick={closeModal} className="btn-secondary btn-large">
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p>Think this is yours? Click below to file a claim and answer verification questions to help us confirm ownership.</p>
                <div className="cta-buttons mt-20">
                  <Link to={`/founditems/${selectedItem._id}/claim`} onClick={closeModal} className="btn-primary btn-large">
                    File a Claim
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FoundItemList;