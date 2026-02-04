import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as claimService from '../../services/claimService';

const VisitorClaimView = () => {
    const { claimId } = useParams();
    const navigate = useNavigate();
    const [claim, setClaim] = useState(null);

    useEffect(() => {
        const fetchClaim = async () => {
            const data = await claimService.show(claimId);
            setClaim(data);
        };
        fetchClaim();
    }, [claimId]);

    if (!claim) return (
        <div className="page-content">
            <div className="card text-center">
                <p>Loading...</p>
            </div>
        </div>
    );

    const isApproved = claim.status === 'APPROVED';
    const isDenied = claim.status === 'DENIED';
    const isPending = claim.status === 'PENDING';

    return (
        <div className="page-content">
            <form onSubmit={(e) => e.preventDefault()}>
                <h2>Your Claim Details</h2>

                {/* Status Banner */}
                {isApproved && (
                    <div className="status-banner approved">
                        <h3>✅ Claim Approved!</h3>
                        <p>Your claim has been approved. Please follow the pickup instructions below.</p>
                    </div>
                )}

                {isDenied && (
                    <div className="status-banner denied">
                        <h3>❌ Claim Denied</h3>
                        <p>Your claim was not approved. See the reason below.</p>
                    </div>
                )}

                {isPending && (
                    <div className="status-banner pending">
                        <h3>⏳ Claim Pending Review</h3>
                        <p>Your claim is currently being reviewed by staff. You can edit your claim if needed.</p>
                    </div>
                )}

                {/* Item Information */}
                <div className="mb-20">
                    <h3>Item Information</h3>
                    <p><span className="label">Item:</span> {claim.itemId?.publicDescription || claim.itemId?.title}</p>
                    <p><span className="label">Category:</span> {claim.itemId?.category}</p>
                    <p><span className="label">Location Found:</span> {claim.itemId?.locationFound}</p>
                    <p><span className="label">Date Found:</span> {claim.itemId?.dateFound ? new Date(claim.itemId.dateFound).toLocaleDateString() : 'N/A'}</p>
                </div>

                {/* Your Contact Information */}
                <div className="mb-20">
                    <h3>Your Contact Information</h3>
                    <p><span className="label">Email:</span> {claim.contactEmail}</p>
                    <p><span className="label">Phone:</span> {claim.contactPhone}</p>
                    <p><span className="label">Submitted:</span> {new Date(claim.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Your Answers */}
                <div className="mb-20">
                    <h3>Your Verification Answers</h3>
                    {claim.answers && claim.answers.map((answer, index) => (
                        <div key={index} className="mb-20">
                            <p><span className="label">Q:</span> {answer.question}</p>
                            <p><span className="label">A:</span> {answer.answer}</p>
                        </div>
                    ))}
                </div>

                {claim.additionalDetails && (
                    <div className="mb-20">
                        <h3>Additional Details You Provided</h3>
                        <p>{claim.additionalDetails}</p>
                    </div>
                )}

                {/* Current Status */}
                <div className="mb-20">
                    <h3>Current Status</h3>
                    <p className={`status-badge ${claim.status.toLowerCase()}`}>{claim.status}</p>
                </div>

                {/* APPROVED - Pickup Instructions */}
                {isApproved && (
                    <div className="mb-20 pickup-instructions">
                        <h3>📋 Pickup Instructions</h3>
                        <p>Please bring a valid photo ID to pick up your item.</p>
                        <p>Visit the Lost & Found desk during business hours (Monday-Friday, 9am-5pm).</p>
                        <p>Reference your claim ID: <span className="label">{claim._id}</span></p>
                        {claim.reviewNotes && (
                            <div className="mt-20">
                                <p><span className="label">Staff Notes:</span> {claim.reviewNotes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* DENIED - Reason */}
                {isDenied && claim.reviewNotes && (
                    <div className="mb-20 denial-reason">
                        <h3>Reason for Denial</h3>
                        <p>{claim.reviewNotes}</p>
                        <p className="warning-text mt-20">If you believe this was a mistake, please contact the Lost & Found office directly.</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="cta-buttons">
                    {isPending && (
                        <button 
                            onClick={() => navigate(`/founditems/${claim.itemId._id}/claim?edit=${claimId}`)} 
                            className="btn-primary"
                            type="button"
                        >
                            Edit Your Claim
                        </button>
                    )}
                    <button onClick={() => navigate('/claims')} className="btn-secondary" type="button">
                        Back to My Claims
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VisitorClaimView;