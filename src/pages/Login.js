import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Make sure to create this file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Member Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="extra-links">
          <p><Link to="#">Forgot Username / Password?</Link></p>
          <p><Link to="/signup">Create your Account →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
