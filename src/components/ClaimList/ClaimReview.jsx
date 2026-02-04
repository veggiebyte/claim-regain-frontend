import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as claimService from '../../services/claimService';

const ClaimReview = () => {
    const { claimId } = useParams();
    const navigate = useNavigate();
    const [claim, setClaim] = useState(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [pickupNotes, setPickupNotes] = useState('');
    const [pickupVerificationType, setPickupVerificationType] = useState('ID_CHECKED');

    useEffect(() => {
        const fetchClaim = async () => {
            const data = await claimService.show(claimId);
            setClaim(data);
        };
        fetchClaim();
    }, [claimId]);

    const handleReview = async (status) => {
        if (!reviewNotes.trim()) {
            alert('Please add review notes before submitting your decision.');
            return;
        }
        try {
            await claimService.reviewClaim(claimId, { status, reviewNotes });
            alert(`Claim ${status.toLowerCase()} successfully!`);
            window.location.href = '/claims';
        } catch (error) {
            console.log(error);
            alert('Error reviewing claim. Please try again.');
        }
    };

    const handleMarkPickup = async () => {
        if (!pickupNotes.trim()) {
            alert('Please add pickup notes before marking as complete.');
            return;
        }
        try {
            await claimService.markPickupComplete(claimId, {
                pickupVerificationType,
                pickupNotes
            });
            alert('Pickup marked as complete! Item will no longer appear in public view.');
            window.location.href = '/claims';
        } catch (error) {
            console.log(error);
            alert('Error marking pickup complete. Please try again.');
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

                {claim.status !== 'PENDING' && (
                    <div className="mb-20">
                        <h3>⚠️ Important</h3>
                        <p className="text-center warning-text">This claim was previously {claim.status.toLowerCase()}. You can update the status or add new notes below.</p>
                    </div>
                )}

                {claim.pickupCompleted && (
                    <div className="mb-20 status-banner approved">
                        <h3>✅ Pickup Completed</h3>
                        <p>This item was picked up on {new Date(claim.pickupDate).toLocaleDateString()}</p>
                        <p><span className="label">Verification:</span> {claim.pickupVerificationType}</p>
                        {claim.pickupNotes && <p><span className="label">Notes:</span> {claim.pickupNotes}</p>}
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

                {claim.status !== 'PENDING' && claim.reviewNotes && (
                    <div className="mb-20">
                        <h3>Previous Review Notes</h3>
                        <p>{claim.reviewNotes}</p>
                    </div>
                )}

                {/* APPROVE/DENY SECTION */}
                {!claim.pickupCompleted && (
                    <>
                        <label>
                            {claim.status === 'PENDING' ? 'Review Notes:' : 'Update Review Notes:'}
                            <textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder={claim.status === 'PENDING' ? 'Add notes about your decision...' : 'Add updated notes...'}
                            />
                        </label>

                        <div className="cta-buttons">
                            {claim.status === 'PENDING' ? (
                                <>
                                    <button onClick={() => handleReview('APPROVED')} className="btn-primary">
                                        Approve Claim
                                    </button>
                                    <button onClick={() => handleReview('DENIED')} className="btn-danger">
                                        Deny Claim
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => {
                                        if (window.confirm(`This claim is currently ${claim.status}. Change status to APPROVED?`)) {
                                            handleReview('APPROVED');
                                        }
                                    }} className="btn-primary">
                                        {claim.status === 'APPROVED' ? 'Keep Approved' : 'Change to Approved'}
                                    </button>
                                    <button onClick={() => {
                                        if (window.confirm(`This claim is currently ${claim.status}. Change status to DENIED?`)) {
                                            handleReview('DENIED');
                                        }
                                    }} className="btn-danger">
                                        {claim.status === 'DENIED' ? 'Keep Denied' : 'Change to Denied'}
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* PICKUP COMPLETE SECTION - Only show if APPROVED and not yet picked up */}
                {claim.status === 'APPROVED' && !claim.pickupCompleted && (
                    <div className="mb-20" style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #e5e7eb' }}>
                        <h3>Mark Pickup Complete</h3>
                        <p className="mb-20">Once the claimant picks up this item and shows proper ID, mark it as complete below. This will remove the item from public view.</p>
                        
                        <label>
                            Verification Type:
                            <select
                                value={pickupVerificationType}
                                onChange={(e) => setPickupVerificationType(e.target.value)}
                            >
                                <option value="ID_CHECKED">ID Checked</option>
                                <option value="MATCHED_DESCRIPTION">Matched Description</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </label>

                        <label>
                            Pickup Notes:
                            <textarea
                                value={pickupNotes}
                                onChange={(e) => setPickupNotes(e.target.value)}
                                placeholder="Notes about the pickup (e.g., ID verified, showed driver's license)..."
                            />
                        </label>

                        <div className="cta-buttons">
                            <button onClick={handleMarkPickup} className="btn-primary">
                                Mark as Picked Up
                            </button>
                        </div>
                    </div>
                )}

                <div className="cta-buttons">
                    <button onClick={() => navigate('/claims')} className="btn-secondary">
                        Back to Claims
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClaimReview;