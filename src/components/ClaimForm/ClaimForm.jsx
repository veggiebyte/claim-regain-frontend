import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as claimService from '../../services/claimService';

const ClaimForm = ({ foundItemId, verificationQuestions }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    answers: verificationQuestions.map(q => ({ question: q.question, answer: '' })),
    additionalDetails: '',
  });

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
      };
      await claimService.create(claimData);
      alert('Claim submitted successfully! Staff will review your answers.');
      navigate('/claims');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Verification Questions</h4>
      {formData.answers.map((answer, index) => (
        <div key={index}>
          <label>{answer.question}</label>
          <input
            type="text"
            value={answer.answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required
          />
        </div>
      ))}
      
      <label>
        Additional Details:
        <textarea
          value={formData.additionalDetails}
          onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
          placeholder="Any additional information about the item..."
        />
      </label>

      <button type="submit">Submit Claim</button>
    </form>
  );
};

export default ClaimForm;