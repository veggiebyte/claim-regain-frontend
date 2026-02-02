import { Link } from 'react-router';

const Landing = () => {
  return (
    <main className="landing-page">
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Lost Something?</h1>
            <p className="hero-subtitle">
              Browse our found items to see if we have what you're looking for. 
              Our secure system helps reunite people with their belongings through 
              verified claims and safe pickup.
            </p>
            <div className="cta-buttons">
              <Link to="/founditems" className="btn-primary btn-large">
                Browse Found Items
              </Link>
              <Link to="/sign-up" className="btn-secondary btn-large">
                Create Account
              </Link>
            </div>
          </div>
          
          <div className="hero-image">
<img src="/images/hero_image.png" alt="Here Image_I found it!" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;