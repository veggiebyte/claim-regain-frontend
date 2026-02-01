import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router';
import * as foundItemService from '../../services/foundItemService';
import { UserContext } from '../../contexts/UserContext';
import ClaimForm from '../ClaimForm/ClaimForm';

const FoundItemDetails = () => {
    const { foundItemId } = useParams();
    const { user } = useContext(UserContext);
    const [foundItem, setFoundItem] = useState(null);

    useEffect(() => {
        const fetchFoundItem = async () => {
            const data = await foundItemService.show(foundItemId);
            setFoundItem(data);
        };
        fetchFoundItem();
    }, [foundItemId]);

    if (!foundItem) return <p>Loading...</p>;

    return (
        <div>
            <h2>{foundItem.publicDescription}</h2>
            <p><strong>Category:</strong> {foundItem.category}</p>
            <p><strong>Color:</strong> {foundItem.color}</p>
            <p><strong>Location Found:</strong> {foundItem.locationFound}</p>
            <p><strong>Date Found:</strong> {new Date(foundItem.dateFound).toLocaleDateString()}</p>

            {user && foundItem.status === 'FOUND' && (
                <>
                    <h3>Think this is yours?</h3>
                    <ClaimForm foundItemId={foundItemId} verificationQuestions={foundItem.verificationQuestions} />
                </>
            )}

            {!user && foundItem.status === 'FOUND' && (
                <p>
                    <Link to="/sign-in">Sign in</Link> to claim this item.
                </p>
            )}

            {foundItem.status !== 'FOUND' && (
                <p><strong>Status:</strong> {foundItem.status}</p>
            )}
        </div>
    );
};

export default FoundItemDetails;