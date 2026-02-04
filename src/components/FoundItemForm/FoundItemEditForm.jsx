import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as foundItemService from '../../services/foundItemService';

const FoundItemEditForm = () => {
  const navigate = useNavigate();
  const { foundItemId } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const data = await foundItemService.staffShow(foundItemId);
      setFormData(data);
    };
    fetchItem();
  }, [foundItemId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.imageUrls];
    updatedImages[index] = value;
    setFormData({ ...formData, imageUrls: updatedImages });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.verificationQuestions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, verificationQuestions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      verificationQuestions: [...formData.verificationQuestions, { question: '', answer: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await foundItemService.update(foundItemId, formData);
      navigate('/staff/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  if (!formData) return (
    <div className="page-content">
      <div className="card text-center">
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page-content">
      <form onSubmit={handleSubmit}>
        <h2>Edit Found Item</h2>

        <p className="warning-text text-center">* indicates required field</p>
        
        <label>
          Title (Staff Reference): *
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category: *
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="CLOTHING">Clothing</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="JEWELRY">Jewelry</option>
            <option value="BAG">Bag</option>
            <option value="DRINKWARE">Drinkware</option>
            <option value="KEYS">Keys</option>
            <option value="OTHER">Other</option>
          </select>
        </label>

        <label>
          Color:
          <input
            type="text"
            name="color"
            value={formData.color || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          Public Description (Vague): *
          <textarea
            name="publicDescription"
            value={formData.publicDescription}
            onChange={handleChange}
            placeholder="Vague description visible to public"
            required
          />
        </label>

        <label>
          Private Notes (Staff Only):
          <textarea
            name="privateNotes"
            value={formData.privateNotes || ''}
            onChange={handleChange}
            placeholder="Detailed notes not visible to public"
          />
        </label>

        <label>
          Date Found: *
          <input
            type="date"
            name="dateFound"
            value={formData.dateFound ? formData.dateFound.split('T')[0] : ''}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location Found: *
          <input
            type="text"
            name="locationFound"
            value={formData.locationFound}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Storage Location: *
          <input
            type="text"
            name="storageLocation"
            value={formData.storageLocation || ''}
            onChange={handleChange}
            required
          />
        </label>

        <h3>Item Photos (Staff Only - at least one required)</h3>
        {formData.imageUrls && formData.imageUrls.map((url, index) => (
          <label key={index}>
            Image URL {index + 1}: {index === 0 && '*'}
            <input
              type="text"
              value={url || ''}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="https://example.com/image.jpg"
              required={index === 0}
            />
          </label>
        ))}

        <label>
          Requires ID for Pickup:
          <input
            type="checkbox"
            name="requiresIdForPickup"
            checked={formData.requiresIdForPickup}
            onChange={handleChange}
          />
        </label>

        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="FOUND">FOUND</option>
            <option value="CLAIMED">CLAIMED</option>
            <option value="DONATED">DONATED</option>
            <option value="DISPOSED">DISPOSED</option>
          </select>
        </label>

        <h3>Verification Questions (at least two required)</h3>
        {formData.verificationQuestions && formData.verificationQuestions.map((q, index) => (
          <div key={index}>
            <label>
              Question {index + 1}: *
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                placeholder="e.g., What brand is the item?"
                required
              />
            </label>
            <label>
              Answer: *
              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                placeholder="Correct answer"
                required
              />
            </label>
          </div>
        ))}
        
        <button type="button" onClick={addQuestion} className="btn-secondary">
          Add Another Question
        </button>

        <div className="cta-buttons">
          <button type="submit" className="btn-primary">Update Item</button>
          <button type="button" onClick={() => navigate('/staff/dashboard')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default FoundItemEditForm;