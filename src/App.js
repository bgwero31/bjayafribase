import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home"; // 👈 your nice dark mode Home
import Chat from "./pages/Chat"; // 👈 make sure these paths match your folders!
import Market from "./pages/Market";
import Profile from "./pages/Profile";

export default function App() {
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
