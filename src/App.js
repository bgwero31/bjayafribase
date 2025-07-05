// src/App.js
import React, { useState } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Market from "./pages/Market";
import Profile from "./pages/Profile";

export default function App() {
  const [page, setPage] = useState("home");

  let CurrentPage;
  switch (page) {
    case "chat":
      CurrentPage = Chat;
      break;
    case "market":
      CurrentPage = Market;
      break;
    case "profile":
      CurrentPage = Profile;
      break;
    default:
      CurrentPage = Home;
  }

  return (
    <div>
      <nav style={{ margin: "20px" }}>
        <button onClick={() => setPage("home")}>🏠 Home</button>
        <button onClick={() => setPage("chat")}>💬 Chat</button>
        <button onClick={() => setPage("market")}>🛍️ Market</button>
        <button onClick={() => setPage("profile")}>👤 Profile</button>
      </nav>
      <CurrentPage />
    </div>
  );
}
