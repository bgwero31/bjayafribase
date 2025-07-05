import React, { useState } from "react";
import Home from "./Home"; // ✅ Adjust path if needed
import Chat from "./pages/Chat";
import Market from "./pages/Market";
import Profile from "./pages/Profile";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && <Home onNavigate={setPage} />}
      {page === "chat" && <Chat />}
      {page === "market" && <Market />}
      {page === "profile" && <Profile />}
    </>
  );
}
