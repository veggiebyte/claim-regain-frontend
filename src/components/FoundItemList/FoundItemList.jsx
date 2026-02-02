import { Link } from 'react-router';
import { useState } from 'react';

const FoundItemList = ({ foundItems }) => {
  const [sortBy, setSortBy] = useState('dateFound');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter items by search query
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

  // Sort the filtered items
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
        <div className="browse-title-container">
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

      <div className="table-container">
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
                  <Link to={`/founditems/${item._id}`} className="view-link">
                    View/Claim →
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

export default FoundItemList;