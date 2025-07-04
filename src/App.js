import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import Chatroom from './pages/Chatroom';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#333' }}>
        <Link to="/" style={{ color: '#fff', marginRight: '10px' }}>Marketplace</Link>
        <Link to="/chat" style={{ color: '#fff', marginRight: '10px' }}>Chatroom</Link>
        <Link to="/profile" style={{ color: '#fff' }}>Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/chat" element={<Chatroom />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
