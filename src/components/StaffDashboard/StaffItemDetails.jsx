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

  if (!foundItem) return (
    <div className="page-content">
      <div className="card text-center">
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <div className="detail-wrapper">
        <div className="card detail-card">
          <h2 className="text-center">{foundItem.title}</h2>
          
          {foundItem.imageUrls && foundItem.imageUrls.length > 0 && (
            <div className="mb-20">
              <h3>Photos:</h3>
              <div className="photo-grid">
                {foundItem.imageUrls.map((url, index) => (
                  url && <img key={index} src={url} alt={`${foundItem.title} ${index + 1}`} />
                ))}
              </div>
            </div>
          )}

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
            <div>
              {foundItem.verificationQuestions.map((q, index) => (
                <div key={index} className="mb-20">
                  <p><strong>Q:</strong> {q.question}</p>
                  <p><strong>A:</strong> {q.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No verification questions</p>
          )}

<div className="cta-buttons mt-20">
  <Link to={`/staff/founditems/${foundItemId}/edit`} className="btn-primary btn-large">
    Edit Item
  </Link>
  <Link to="#" onClick={(e) => { e.preventDefault(); handleDelete(); }} className="btn-primary btn-large">
    Delete Item
  </Link>
</div>

<div className="text-center mt-20">
  <Link to="/staff/dashboard">← Back to Dashboard</Link>
</div>
        </div>
      </div>
    </div>
  );
};

export default StaffItemDetails;