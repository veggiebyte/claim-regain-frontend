import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as foundItemService from '../../services/foundItemService';
import * as claimService from '../../services/claimService';

const ClaimForm = () => {
  const { foundItemId } = useParams();
  const navigate = useNavigate();
  const [foundItem, setFoundItem] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const data = await foundItemService.show(foundItemId);
      setFoundItem(data);
      if (data.verificationQuestions && data.verificationQuestions.length > 0) {
        setFormData({
          answers: data.verificationQuestions.map(q => ({ question: q.question, answer: '' })),
          additionalDetails: '',
          contactEmail: '',
          contactPhone: ''
        });
      }
    };
    fetchItem();
  }, [foundItemId]);

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
      await claimService.create(claimData);
      alert('Claim submitted successfully! Staff will review your answers.');
      window.location.href = '/claims';
    } catch (error) {
      console.log(error);
      alert('Error submitting claim. Please try again.');
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
        <h2>File a Claim</h2>

        <div className="mb-20">
          <h3>Item Details</h3>
          <p><strong>Description:</strong> {foundItem.publicDescription}</p>
          <p><strong>Category:</strong> {foundItem.category}</p>
          <p><strong>Location Found:</strong> {foundItem.locationFound}</p>
        </div>

        <h3>Verification Questions</h3>
        {formData.answers.map((answer, index) => (
          <label key={index}>
            {answer.question}
            <input
              type="text"
              value={answer.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              required
            />
          </label>
        ))}

        <label>
          Contact Email:
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            required
          />
        </label>

        <label>
          Contact Phone:
          <input
            type="text"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            required
          />
        </label>

        <label>
          Additional Details:
          <textarea
            value={formData.additionalDetails}
            onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
            placeholder="Any additional information that proves this is your item..."
          />
        </label>

        <div className="cta-buttons">
          <button type="submit" className="btn-primary">Submit Claim</button>
          <button type="button" onClick={() => navigate('/founditems')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;