import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import * as foundItemService from '../../services/foundItemService';

const StaffItemDetails = () => {
  const { foundItemId } = useParams();
  const navigate = useNavigate();
  const [foundItem, setFoundItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const data = await foundItemService.staffShow(foundItemId);
      setFoundItem(data);
    };
    fetchItem();
  }, [foundItemId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await foundItemService.deleteFoundItem(foundItemId);
      navigate('/staff/dashboard');
    }
  };

  if (!foundItem) return <p>Loading...</p>;

  return (
    <div>
      <h1>Staff View - Item Details</h1>
      
      <h2>{foundItem.title}</h2>
      
      <div>
        <h3>Photos:</h3>
        {foundItem.imageUrls && foundItem.imageUrls.length > 0 ? (
          foundItem.imageUrls.map((url, index) => (
            url && <img key={index} src={url} alt={`${foundItem.title} ${index + 1}`} style={{ maxWidth: '300px', margin: '10px' }} />
          ))
        ) : (
          <p>No photos</p>
        )}
      </div>

      <h3>Public Information:</h3>
      <p><strong>Public Description:</strong> {foundItem.publicDescription}</p>
      <p><strong>Category:</strong> {foundItem.category}</p>
      <p><strong>Color:</strong> {foundItem.color}</p>
      <p><strong>Date Found:</strong> {new Date(foundItem.dateFound).toLocaleDateString()}</p>
      <p><strong>Location Found:</strong> {foundItem.locationFound}</p>

      <h3>Staff-Only Information:</h3>
      <p><strong>Private Notes:</strong> {foundItem.privateNotes || 'None'}</p>
      <p><strong>Storage Location:</strong> {foundItem.storageLocation || 'Not specified'}</p>
      <p><strong>Requires ID for Pickup:</strong> {foundItem.requiresIdForPickup ? 'Yes' : 'No'}</p>
      <p><strong>Status:</strong> {foundItem.status}</p>

      <h3>Verification Questions:</h3>
      {foundItem.verificationQuestions && foundItem.verificationQuestions.length > 0 ? (
        <ul>
          {foundItem.verificationQuestions.map((q, index) => (
            <li key={index}>
              <strong>Q:</strong> {q.question} <br />
              <strong>A:</strong> {q.answer}
            </li>
          ))}
        </ul>
      ) : (
        <p>No verification questions</p>
      )}

      <div>
        <Link to={`/staff/founditems/${foundItemId}/edit`}>
          <button>Edit Item</button>
        </Link>
        <button onClick={handleDelete}>Delete Item</button>
        <Link to="/staff/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default StaffItemDetails;