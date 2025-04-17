// src/pages/Home.js
import React from 'react';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome to the Quiz App 🎉</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
