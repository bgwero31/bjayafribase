// src/App.js
import React, { useState } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Market from "./pages/Market";
import Profile from "./pages/Profile";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    if (page === "chat") return <Chat />;
    if (page === "market") return <Market />;
    if (page === "profile") return <Profile />;
    return <Home onNavigate={setPage} />;
  };

  return (
    <div>
      <nav style={navStyle}>
        <button onClick={() => setPage("home")}>🏠 Home</button>
        <button onClick={() => setPage("chat")}>💬 Chat</button>
        <button onClick={() => setPage("market")}>🛍️ Market</button>
        <button onClick={() => setPage("profile")}>👤 Profile</button>
      </nav>
      {renderPage()}
    </div>
  );
}

const navStyle = {
  display: "flex",
  gap: "20px",
  padding: "20px",
  background: "#222",
  color: "#fff"
};
