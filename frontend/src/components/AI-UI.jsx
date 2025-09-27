// import React, { useState } from "react";
// import "./AIPage.css";

// export default function AIChatPage() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatHistory, setChatHistory] = useState([
//     { id: 1, name: "First Chat", messages: [] },
//   ]);
//   const [activeChat, setActiveChat] = useState(chatHistory[0]);
//   const [darkMode, setDarkMode] = useState(false);
//   const [editingChatId, setEditingChatId] = useState(null);

//   // Send new message
//   const handleSend = () => {
//     if (!input.trim()) return;
//     const newMessage = { sender: "user", text: input };
//     const updatedMessages = [...messages, newMessage, { sender: "ai", text: "AI response..." }];
//     setMessages(updatedMessages);

//     // update active chat
//     setChatHistory((prev) =>
//       prev.map((chat) =>
//         chat.id === activeChat.id ? { ...chat, messages: updatedMessages } : chat
//       )
//     );
//     setInput("");
//   };

//   // New Chat
//   const handleNewChat = () => {
//     const newChat = {
//       id: Date.now(),
//       name: "New Chat",
//       messages: [],
//     };
//     setChatHistory([newChat, ...chatHistory]);
//     setActiveChat(newChat);
//     setMessages([]);
//   };

//   // Delete Chat
//   const handleDeleteChat = (id) => {
//     const filtered = chatHistory.filter((chat) => chat.id !== id);
//     setChatHistory(filtered);
//     if (activeChat.id === id && filtered.length > 0) {
//       setActiveChat(filtered[0]);
//       setMessages(filtered[0].messages);
//     } else if (filtered.length === 0) {
//       setActiveChat(null);
//       setMessages([]);
//     }
//   };

//   // Edit Chat Name
//   const handleEditChat = (id) => {
//     setEditingChatId(id);
//   };

//   const handleRename = (id, newName) => {
//     setChatHistory((prev) =>
//       prev.map((chat) =>
//         chat.id === id ? { ...chat, name: newName || "Untitled Chat" } : chat
//       )
//     );
//     setEditingChatId(null);
//   };

//   // Clear Messages
//   const clearMessages = () => {
//     setMessages([]);
//     setChatHistory((prev) =>
//       prev.map((chat) =>
//         chat.id === activeChat.id ? { ...chat, messages: [] } : chat
//       )
//     );
//   };

//   return (
//     <div className={`ai-page ${darkMode ? "dark" : ""}`}>
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="user-profile">
//           <div className="avatar">👤</div>
//           <span className="username">Ahmed Noaman</span>
//         </div>

//         <button className="new-chat-btn" onClick={handleNewChat}>
//           + New Chat
//         </button>

//         <div className="chat-history">
//           {chatHistory.map((chat) => (
//             <div
//               key={chat.id}
//               className={`chat-history-item ${
//                 activeChat?.id === chat.id ? "active" : ""
//               }`}
//               onClick={() => {
//                 setActiveChat(chat);
//                 setMessages(chat.messages);
//               }}
//             >
//               {editingChatId === chat.id ? (
//                 <input
//                   type="text"
//                   defaultValue={chat.name}
//                   onBlur={(e) => handleRename(chat.id, e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleRename(chat.id, e.target.value);
//                     }
//                   }}
//                   autoFocus
//                   className="rename-input"
//                 />
//               ) : (
//                 <span>{chat.name}</span>
//               )}

//               <div className="chat-actions">
//                 <button
//                   className="edit-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleEditChat(chat.id);
//                   }}
//                 >
//                   ✎
//                 </button>
//                 <button
//                   className="delete-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteChat(chat.id);
//                   }}
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="sidebar-actions">
//           <button onClick={clearMessages}>Clear Chat</button>
//           <button onClick={() => setDarkMode(!darkMode)}>
//             {darkMode ? "Light Mode" : "Dark Mode"}
//           </button>
//         </div>
//       </aside>

//       {/* Main Chat Section */}
//       <main className="chat-section">
//         <div className="chat-messages">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`message ${msg.sender === "user" ? "user" : "ai"}`}
//             >
//               {msg.text}
//             </div>
//           ))}
//         </div>

//         {/* Input Area */}
//         <div className="chat-input-area">
//           <input
//             type="text"
//             value={input}
//             placeholder="Type a message..."
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />
//           <button onClick={handleSend}>Send</button>
//         </div>
//       </main>
//     </div>
//   );
// }
import React, { useState } from "react";
import Markdown from "markdown-to-jsx";
import "./AIPage.css";

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, name: "First Chat", messages: [] },
  ]);
  const [activeChat, setActiveChat] = useState(chatHistory[0]);
  const [darkMode, setDarkMode] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);

  // 🔹 Send message with streaming
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const aiMessage = { sender: "ai", text: "" };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          grade: "9",
          subject: "science",
          cumulative: false,
        }),
      });

      if (!response.body) throw new Error("No stream found");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialText += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: "ai", text: partialText };
          return updated;
        });
      }

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, messages: [...updatedMessages, { sender: "ai", text: partialText }] }
            : chat
        )
      );
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error connecting to AI" },
      ]);
    }

    setInput("");
  };

  const handleNewChat = () => {
    const newChat = { id: Date.now(), name: "New Chat", messages: [] };
    setChatHistory([newChat, ...chatHistory]);
    setActiveChat(newChat);
    setMessages([]);
  };

  const handleDeleteChat = (id) => {
    const filtered = chatHistory.filter((chat) => chat.id !== id);
    setChatHistory(filtered);
    if (activeChat.id === id && filtered.length > 0) {
      setActiveChat(filtered[0]);
      setMessages(filtered[0].messages);
    } else if (filtered.length === 0) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  const handleEditChat = (id) => setEditingChatId(id);

  const handleRename = (id, newName) => {
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, name: newName || "Untitled Chat" } : chat
      )
    );
    setEditingChatId(null);
  };

  const clearMessages = () => {
    setMessages([]);
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id ? { ...chat, messages: [] } : chat
      )
    );
  };

  return (
    <div className={`ai-page ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-profile">
          <div className="avatar">👤</div>
          <span className="username">Ahmed Noaman</span>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          + New Chat
        </button>

        <div className="chat-history">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`chat-history-item ${
                activeChat?.id === chat.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveChat(chat);
                setMessages(chat.messages);
              }}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  defaultValue={chat.name}
                  onBlur={(e) => handleRename(chat.id, e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleRename(chat.id, e.target.value)
                  }
                  autoFocus
                  className="rename-input"
                />
              ) : (
                <span>{chat.name}</span>
              )}

              <div className="chat-actions">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditChat(chat.id);
                  }}
                >
                  ✎
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-actions">
          <button onClick={clearMessages}>Clear Chat</button>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Main Chat Section */}
      <main className="chat-section">
        <div className="chat-messages">
        {messages.map((msg, i) => (
            <div
            key={i}
            className={`message ${msg.sender === "user" ? "user" : "ai"}`}
            >
            {msg.sender === "ai" ? (
                <Markdown>{msg.text}</Markdown>
            ) : (
                msg.text
            )}
            </div>
        ))}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <input
            type="text"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </main>
    </div>
  );
}