// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Chatroom from "./pages/Chatroom";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return (
      <div style={{display:"flex",height:"100vh",justifyContent:"center",alignItems:"center"}}>
        <p style={{fontSize:18,fontWeight:"bold"}}>Checking login...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="/*" element={<Login />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chatroom />} />
            <Route path="/market" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
