import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
    role: 'VISITOR',
  });

  const { username, password, passwordConf, role } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      if (newUser.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf && role);
  };

  return (
    <div className="page-content">
      <div className="hero-container">
        <div className="hero-image">
          <img src="/images/lost_found.jpg" alt="Lost and Found Box" />
        </div>
        
        <div className="hero-content">
          <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {message && <p className="error-message">{message}</p>}
            
            <label htmlFor='username'>
              Username:
              <input
                type='text'
                id='username'
                value={username}
                name='username'
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor='password'>
              Password:
              <input
                type='password'
                id='password'
                value={password}
                name='password'
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor='passwordConf'>
              Confirm Password:
              <input
                type='password'
                id='passwordConf'
                value={passwordConf}
                name='passwordConf'
                onChange={handleChange}
                required
              />
            </label>

            <label htmlFor='role'>
              I am a:
              <select
                id='role'
                name='role'
                value={role}
                onChange={handleChange}
                required
              >
                <option value='VISITOR'>Visitor (can claim items)</option>
                <option value='STAFF'>Staff (can log found items)</option>
              </select>
            </label>

            <div className="cta-buttons">
              <button type="submit" disabled={isFormInvalid()} className="btn-primary">Sign Up</button>
              <button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;