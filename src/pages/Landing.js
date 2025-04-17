import React from 'react';
import './Landing.css';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1>🎓 Welcome to EduQuiz</h1>
        <p>Your gateway to interactive learning</p>
        <div className="btn-group">
          <Link to="/login"><button className="primary-btn">Login</button></Link>
          <Link to="/signup"><button className="secondary-btn">Sign Up</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;


