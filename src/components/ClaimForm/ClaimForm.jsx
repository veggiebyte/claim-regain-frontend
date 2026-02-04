import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import * as foundItemService from '../../services/foundItemService';
import * as claimService from '../../services/claimService';

const ClaimForm = () => {
  const { foundItemId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editClaimId = searchParams.get('edit'); // Get claim ID from query params
  const [foundItem, setFoundItem] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Always fetch the item
      const itemData = await foundItemService.show(foundItemId);
      setFoundItem(itemData);

      // If edit mode, fetch existing claim
      if (editClaimId) {
        const claimData = await claimService.show(editClaimId);
        setIsEditMode(true);
        setFormData({
          answers: claimData.answers || [],
          additionalDetails: claimData.additionalDetails || '',
          contactEmail: claimData.contactEmail || '',
          contactPhone: claimData.contactPhone || ''
        });
      } else {
        // New claim mode
        if (itemData.verificationQuestions && itemData.verificationQuestions.length > 0) {
          setFormData({
            answers: itemData.verificationQuestions.map(q => ({ question: q.question, answer: '' })),
            additionalDetails: '',
            contactEmail: '',
            contactPhone: ''
          });
        }
      }
    };
    fetchData();
  }, [foundItemId, editClaimId]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index].answer = value;
    setFormData({ ...formData, answers: updatedAnswers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const claimData = {
        itemId: foundItemId,
        answers: formData.answers,
        additionalDetails: formData.additionalDetails,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      };

      if (isEditMode) {
        // Update existing claim
        await claimService.update(editClaimId, claimData);
        alert('Claim updated successfully!');
      } else {
        // Create new claim
        await claimService.create(claimData);
        alert('Claim submitted successfully! Staff will review your answers.');
      }
      
      window.location.href = '/claims';
    } catch (error) {
      console.log(error);
      alert(`Error ${isEditMode ? 'updating' : 'submitting'} claim. Please try again.`);
    }
  };

  if (!foundItem || !formData) return (
    <div className="page-content">
      <div className="card text-center">
        <p>Loading...</p>
      </div>
    </div>
  );

  if (!foundItem.verificationQuestions || foundItem.verificationQuestions.length === 0) {
    return (
      <div className="page-content">
        <div className="card text-center">
          <h2>No Verification Questions</h2>
          <p>This item does not have verification questions set up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <form onSubmit={handleSubmit}>
        <h2>{isEditMode ? 'Edit Your Claim' : 'File a Claim'}</h2>

        <div className="mb-20">
          <h3>Item Details</h3>
          <p><span className="label">Description:</span> {foundItem.publicDescription}</p>
          <p><span className="label">Category:</span> {foundItem.category}</p>
          <p><span className="label">Location Found:</span> {foundItem.locationFound}</p>
        </div>

        <p className="warning-text text-center">* indicates required field</p>

        <h3>Verification Questions</h3>
        {formData.answers.map((answer, index) => (
          <label key={index}>
            {answer.question} *
            <input
              type="text"
              value={answer.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              required
            />
          </label>
        ))}

        <label>
          Contact Email: *
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            required
          />
        </label>

        <label>
          Contact Phone: *
          <input
            type="text"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            required
          />
        </label>

        <label>
          Additional Details (optional):
          <textarea
            value={formData.additionalDetails}
            onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
            placeholder="Any additional information that proves this is your item..."
          />
        </label>

        <div className="cta-buttons">
          <button type="submit" className="btn-primary">
            {isEditMode ? 'Update Claim' : 'Submit Claim'}
          </button>
          <button type="button" onClick={() => navigate(isEditMode ? '/claims' : '/founditems')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;