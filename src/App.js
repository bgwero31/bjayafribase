import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chat from "./pages/Chat";
import Market from "./pages/Market";
import Profile from "./pages/Profile";

function Home() {
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
        <Link to="/chat" style={btnStyle}>💬 Chat Room</Link><br />
        <Link to="/market" style={btnStyle}>🛍️ Marketplace</Link><br />
        <Link to="/profile" style={btnStyle}>👤 My Profile</Link>
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
