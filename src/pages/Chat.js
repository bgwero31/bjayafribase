import React, { useState, useEffect, useRef } from "react";
import { db, storage, auth } from "../firebase";
import { ref as dbRef, push, onValue, remove } from "firebase/database";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);

  const user = auth.currentUser;

  useEffect(() => {
    const chatRef = dbRef(db, "messages");
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data).map(([id, msg]) => ({ id, ...msg }));
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !user) return;

    const newMsg = {
      uid: user.uid,
      name: user.displayName || "Anonymous",
      avatar: user.photoURL || "",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      replyTo: replyTo ? replyTo.text : null,
    };

    push(dbRef(db, "messages"), newMsg);
    setMessage("");
    setReplyTo(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const fileRef = storageRef(storage, `chatImages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => console.error("Upload failed", error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          push(dbRef(db, "messages"), {
            uid: user.uid,
            name: user.displayName || "Anonymous",
            avatar: user.photoURL || "",
            imageUrl: downloadURL,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "image",
            replyTo: replyTo ? replyTo.text : null,
          });
        });
      }
    );
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const handleLongPress = (msgId, msgUid) => {
    if (msgUid === user?.uid) {
      if (window.confirm("Delete this message?")) {
        remove(dbRef(db, `messages/${msgId}`));
      }
    }
  };

  let pressTimer;
  const startPressTimer = (msgId, msgUid) => {
    pressTimer = setTimeout(() => handleLongPress(msgId, msgUid), 700);
  };
  const cancelPressTimer = () => clearTimeout(pressTimer);

  return (
    <div style={chatWrapper}>
      <div style={chatHeader}>
        <h2>💬 Welcome to Chatroom</h2>
      </div>

      <div style={messagesContainer}>
        {messages.map((msg) => {
          const isOwn = msg.uid === user?.uid;
          return (
            <div
              key={msg.id}
              onTouchStart={() => startPressTimer(msg.id, msg.uid)}
              onTouchEnd={cancelPressTimer}
              onMouseDown={() => startPressTimer(msg.id, msg.uid)}
              onMouseUp={cancelPressTimer}
              onDoubleClick={() => !isOwn && setReplyTo(msg)} // reply on double click
              style={{
                ...msgStyle,
                alignSelf: isOwn ? "flex-end" : "flex-start",
                backgroundColor: isOwn ? "#dcf8c6" : "#333",
                color: isOwn ? "#000" : "#fff",
                borderTopRightRadius: isOwn ? 0 : "10px",
                borderTopLeftRadius: isOwn ? "10px" : 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {msg.avatar && (
                  <img src={msg.avatar} alt="avatar" style={{ width: 24, height: 24, borderRadius: "50%" }} />
                )}
                <strong>{msg.name}</strong>
              </div>

              {msg.replyTo && (
                <div style={{ fontStyle: "italic", fontSize: 12, marginTop: 4, opacity: 0.6 }}>
                  ↪️ {msg.replyTo}
                </div>
              )}

              {msg.type === "image" ? (
                <img
                  src={msg.imageUrl}
                  alt="sent"
                  style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "6px", cursor: "pointer" }}
                  onClick={() => window.open(msg.imageUrl, "_blank")}
                />
              ) : (
                <div style={{ marginTop: "6px" }}>{msg.text}</div>
              )}

              <div style={timeStyle}>{msg.time}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={inputWrapper}>
        {replyTo && (
          <div style={{ fontSize: 13, marginBottom: 5, color: "#aaa" }}>
            Replying to: <strong>{replyTo.text || "Image"}</strong>{" "}
            <button onClick={() => setReplyTo(null)} style={{ marginLeft: 8 }}>❌</button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <label style={iconButton} title="Send Image">
            📎
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
          </label>

          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={iconButton} title="Add Emoji">
            😊
          </button>
        </div>

        <button onClick={sendMessage} style={btnStyle}>Send</button>

        {showEmojiPicker && (
          <div style={emojiPicker}>
            {["😀", "😂", "😍", "😎", "👍", "🙏", "🔥", "❤️"].map((emoji) => (
              <span
                key={emoji}
                style={{ fontSize: "24px", cursor: "pointer", margin: "5px" }}
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const chatWrapper = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "#121212",
  fontFamily: "Poppins, sans-serif",
};

const chatHeader = {
  padding: "15px",
  backgroundColor: "#00ffcc",
  color: "#000",
  fontWeight: "bold",
  fontSize: "18px",
  textAlign: "center",
};

const messagesContainer = {
  flex: 1,
  padding: "15px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const msgStyle = {
  padding: "10px 14px",
  borderRadius: "12px",
  maxWidth: "75%",
  boxShadow: "0 0 5px rgba(0,0,0,0.2)",
  fontSize: "15px",
  lineHeight: "1.4",
};

const timeStyle = {
  fontSize: "11px",
  color: "#aaa",
  textAlign: "right",
  marginTop: "4px",
};

const inputWrapper = {
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  borderTop: "1px solid #333",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  fontSize: "16px",
  marginBottom: "8px",
};

const btnStyle = {
  padding: "12px",
  backgroundColor: "#00ffcc",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const iconButton = {
  cursor: "pointer",
  fontSize: "22px",
  background: "transparent",
  border: "none",
  color: "#00ffcc",
};

const emojiPicker = {
  marginTop: "10px",
  padding: "10px",
  backgroundColor: "#222",
  borderRadius: "8px",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};
