import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as claimService from '../../services/claimService';

const ClaimReview = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    const fetchClaim = async () => {
      const data = await claimService.show(claimId);
      setClaim(data);
    };
    fetchClaim();
  }, [claimId]);

  const handleReview = async (status) => {
    try {
      await claimService.reviewClaim(claimId, { status, reviewNotes });
      alert(`Claim ${status.toLowerCase()} successfully!`);
      window.location.href = '/claims';
    } catch (error) {
      console.log(error);
      alert('Error reviewing claim. Please try again.');
    }
  };

  if (!claim) return (
    <div className="page-content">
      <div className="card text-center">
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Review Claim</h2>

        {claim.itemId?.imageUrls && claim.itemId.imageUrls.length > 0 && (
          <div className="mb-20">
            <h3>Item Photos</h3>
            <div className="photo-grid">
              {claim.itemId.imageUrls.map((url, index) => (
                url && <img key={index} src={url} alt={`Item ${index + 1}`} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-20">
          <h3>Item Information</h3>
          <p><span className="label">Item:</span> {claim.itemId?.publicDescription || claim.itemId?.title}</p>
          <p><span className="label">Category:</span> {claim.itemId?.category}</p>
          <p><span className="label">Location Found:</span> {claim.itemId?.locationFound}</p>
          <p><span className="label">Date Found:</span> {claim.itemId?.dateFound ? new Date(claim.itemId.dateFound).toLocaleDateString() : 'N/A'}</p>
        </div>

        <div className="mb-20">
          <h3>Claimant Information</h3>
          <p><span className="label">Username:</span> {claim.claimantId?.username}</p>
          <p><span className="label">Email:</span> {claim.contactEmail}</p>
          <p><span className="label">Phone:</span> {claim.contactPhone}</p>
          <p><span className="label">Submitted:</span> {new Date(claim.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="mb-20">
          <h3>Verification Answers</h3>
          {claim.answers && claim.answers.map((answer, index) => (
            <div key={index} className="mb-20">
              <p><span className="label">Q:</span> {answer.question}</p>
              <p><span className="label">A:</span> {answer.answer}</p>
            </div>
          ))}
        </div>

        {claim.additionalDetails && (
          <div className="mb-20">
            <h3>Additional Details</h3>
            <p>{claim.additionalDetails}</p>
          </div>
        )}

        <div className="mb-20">
          <h3>Current Status</h3>
          <p>{claim.status}</p>
        </div>

        <label>
          Review Notes:
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Add notes about your decision..."
          />
        </label>

        <div className="cta-buttons">
          <button onClick={() => handleReview('APPROVED')} className="btn-primary">
            Approve Claim
          </button>
          <button onClick={() => handleReview('DENIED')} className="btn-danger">
            Deny Claim
          </button>
          <button onClick={() => navigate('/claims')} className="btn-secondary">
            Back to Claims
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimReview;