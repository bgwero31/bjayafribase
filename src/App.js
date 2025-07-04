// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Market from "./pages/Market";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SuccessScreen from "./pages/SuccessScreen"; // ✅ optional

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212",
        color: "#fff",
        fontFamily: "Poppins, sans-serif"
      }}>
        <p style={{ fontSize: 18, fontWeight: "bold" }}>Checking login...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/market" element={<Market />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/success" element={<SuccessScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

// ✅ This is your dark landing with buttons — when logged in
function Landing() {
  return (
    <div style={{
      background: "#121212",
      color: "#fff",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
      padding: "20px"
    }}>
      <h1>🔥 Welcome to Afribase</h1>
      <p>Connect • Chat • Hustle • Sell</p>

      <div style={{ marginTop: "40px" }}>
        <a href="/chat" style={btnStyle}>💬 Chat Room</a><br />
        <a href="/market" style={btnStyle}>🛍️ Marketplace</a><br />
        <a href="/profile" style={btnStyle}>👤 My Profile</a>
      </div>
    </div>
  );
}

const btnStyle = {
  backgroundColor: "#00ffcc",
  color: "#000",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "18px",
  margin: "10px 0",
  display: "inline-block"
};

export default App;
