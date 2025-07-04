// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Home from "./pages/Home";
import Chat from "./pages/Chatroom";          // fixed import name
import Market from "./pages/Marketplace";     // fixed import name
import Profile from "./pages/Profile";
import Login from "./pages/Login";
// Removed Inbox import because you don't have Inbox.js

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
      <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: 18, fontWeight: "bold" }}>Checking login...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          // Redirect all routes to login if not logged in (like second version)
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/market" element={<Market />} />
            <Route path="/profile" element={<Profile />} />
            {/* Remove /inbox route since you don't have Inbox.js */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
