import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as foundItemService from '../../services/foundItemService';

const FoundItemForm = ({ handleAddFoundItem }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        color: '',
        publicDescription: '',
        privateNotes: '',
        dateFound: '',
        locationFound: '',
        storageLocation: '',
        imageUrls: ['', '', ''],
        requiresIdForPickup: false,
        verificationQuestions: [
            { question: '', answer: '' },
            { question: '', answer: '' },
        ],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.verificationQuestions];
        updatedQuestions[index][field] = value;
        setFormData({ ...formData, verificationQuestions: updatedQuestions });
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...formData.imageUrls];
        updatedImages[index] = value;
        setFormData({ ...formData, imageUrls: updatedImages });
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
            await handleAddFoundItem(formData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Log New Found Item</h2>

            <p className="warning-text text-center">* indicates required field</p>

            <label>
                Title: *
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
                    value={formData.color}
                    onChange={handleChange}
                />
            </label>

            <label>
                Public Description: *
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
                    value={formData.privateNotes}
                    onChange={handleChange}
                    placeholder="Detailed notes not visible to public"
                />
            </label>

            <label>
                Date Found: *
                <input
                    type="date"
                    name="dateFound"
                    value={formData.dateFound}
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
                    value={formData.storageLocation}
                    onChange={handleChange}
                    required
                />
            </label>

            <h3>Item Photos (Staff Only - at least one required)</h3>
            {formData.imageUrls.map((url, index) => (
                <label key={index}>
                    Image URL {index + 1}: {index === 0 && '*'}
                    <input
                        type="text"
                        value={url}
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

          <h3>Verification Questions (at least two required)</h3>
        {formData.verificationQuestions.map((q, index) => (
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
          <button type="submit" className="btn-primary">
            Log Found Item
          </button>
          <button type="button" onClick={() => navigate('/staff/dashboard')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    );
};

export default FoundItemForm;