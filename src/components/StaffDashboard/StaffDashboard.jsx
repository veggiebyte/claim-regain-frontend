import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as foundItemService from '../../services/foundItemService';

const StaffDashboard = () => {
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    const fetchStaffItems = async () => {
      const data = await foundItemService.staffIndex();
      setFoundItems(data);
    };
    fetchStaffItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await foundItemService.deleteFoundItem(itemId);
      setFoundItems(foundItems.filter(item => item._id !== itemId));
    }
  };

  return (
    <div>
      <h1>Staff Dashboard - Found Items</h1>
      <Link to="/founditems/new">
        <button>Add New Item</button>
      </Link>
      
      {foundItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Item</th>
              <th>Date Found</th>
              <th>Category</th>
              <th>Status</th>
              <th>Claims</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foundItems.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.imageUrls && item.imageUrls[0] ? (
                    <img src={item.imageUrls[0]} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#ccc' }}>No photo</div>
                  )}
                </td>
                <td><strong>{item.title}</strong><br />{item.publicDescription}</td>
                <td>{new Date(item.dateFound).toLocaleDateString()}</td>
                <td>{item.category}</td>
                <td>{item.status}</td>
                <td>{item.claims ? item.claims.length : 0}</td>
                <td>
                  <Link to={`/staff/founditems/${item._id}`}>View</Link> | 
                  <Link to={`/staff/founditems/${item._id}/edit`}> Edit</Link> | 
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffDashboard;