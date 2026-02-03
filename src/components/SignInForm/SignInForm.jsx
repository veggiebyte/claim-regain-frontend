import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      if (signedInUser.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page-content">
      <div className="hero-container">
        <div className="hero-image">
          <img src="/images/lost_book.jpg" alt="Lost book" />
        </div>
        
        <div className="hero-content">
          <form autoComplete='off' onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            {message && <p style={{color: '#a31835', textAlign: 'center', marginTop: 0}}>{message}</p>}
            
            <label htmlFor='username'>
              Username:
              <input
                type='text'
                autoComplete='off'
                id='username'
                value={formData.username}
                name='username'
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor='password'>
              Password:
              <input
                type='password'
                autoComplete='off'
                id='password'
                value={formData.password}
                name='password'
                onChange={handleChange}
                required
              />
            </label>

            <div className="cta-buttons">
              <button type="submit" className="btn-primary">Sign In</button>
              <button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;