import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import * as foundItemService from '../../services/foundItemService';
import * as claimService from '../../services/claimService';
import { UserContext } from '../../contexts/UserContext';

const FoundItemDetails = () => {
    const { foundItemId } = useParams();
    const { user } = useContext(UserContext);
    const [foundItem, setFoundItem] = useState(null);
    const [userClaim, setUserClaim] = useState(null);
    const [isPickedUp, setIsPickedUp] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const itemData = await foundItemService.show(foundItemId);
            setFoundItem(itemData);

            // Check if this item has been picked up
            const claims = await claimService.index();
            const pickedUp = claims.some(
                claim => 
                    (claim.itemId._id === foundItemId || claim.itemId === foundItemId) && 
                    claim.pickupCompleted === true
            );
            setIsPickedUp(pickedUp);

            // If user is logged in, check if they have a claim for this item
            if (user) {
                const existingClaim = claims.find(
                    claim => claim.itemId._id === foundItemId || claim.itemId === foundItemId
                );
                setUserClaim(existingClaim);
            }
        };
        fetchData();
    }, [foundItemId, user]);

    if (!foundItem) return (
        <div className="page-content">
            <div className="card text-center">
                <p>Loading...</p>
            </div>
        </div>
    );

    // If item was picked up, don't show to public
    if (isPickedUp) {
        return (
            <div className="page-content">
                <div className="card text-center">
                    <h2>Item No Longer Available</h2>
                    <p>This item has already been claimed and picked up.</p>
                    <Link to="/founditems" className="btn-primary mt-20">
                        Browse Other Items
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <form onSubmit={(e) => e.preventDefault()}>
                <h2>{foundItem.publicDescription}</h2>

                {foundItem.imageUrls && foundItem.imageUrls.length > 0 && (
                    <div className="mb-20">
                        <h3>Item Photos</h3>
                        <div className="photo-grid">
                            {foundItem.imageUrls.map((url, index) => (
                                url && <img key={index} src={url} alt={`Item ${index + 1}`} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-20">
                    <h3>Item Information</h3>
                    <p><span className="label">Category:</span> {foundItem.category}</p>
                    <p><span className="label">Color:</span> {foundItem.color}</p>
                    <p><span className="label">Location Found:</span> {foundItem.locationFound}</p>
                    <p><span className="label">Date Found:</span> {new Date(foundItem.dateFound).toLocaleDateString()}</p>
                </div>

                {userClaim && (
                    <div className={`status-banner ${userClaim.status.toLowerCase()} mb-20`}>
                        <h3>You Already Filed a Claim</h3>
                        <p>Status: {userClaim.status}</p>
                        {userClaim.status === 'PENDING' && (
                            <p>Your claim is being reviewed by staff.</p>
                        )}
                        {userClaim.status === 'APPROVED' && (
                            <p>Your claim was approved! Check your claims page for pickup instructions.</p>
                        )}
                        {userClaim.status === 'DENIED' && (
                            <p>Your claim was not approved.</p>
                        )}
                    </div>
                )}

                <div className="cta-buttons">
                    {userClaim ? (
                        <Link to="/claims" className="btn-primary">
                            View My Claims
                        </Link>
                    ) : user ? (
                        <Link to={`/founditems/${foundItemId}/claim`} className="btn-primary">
                            File a Claim
                        </Link>
                    ) : (
                        <>
                            <Link to="/sign-in" className="btn-primary">Sign In to Claim</Link>
                            <Link to="/sign-up" className="btn-secondary">Create Account</Link>
                        </>
                    )}
                    
                    <Link to="/founditems" className="btn-secondary">
                        Back to Items
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default FoundItemDetails;