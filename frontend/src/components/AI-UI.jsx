// import React, { useState, useEffect, useRef } from "react";
// import Markdown from "markdown-to-jsx";
// import "./AIPage.css";

// export default function AIChatPage({ currentUser }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatHistory, setChatHistory] = useState([
//     { id: 1, name: "First Chat", messages: [] },
//   ]);
//   const [activeChat, setActiveChat] = useState(chatHistory[0]);
//   const [editingChatId, setEditingChatId] = useState(null);

//   const [subject, setSubject] = useState("science");
//   const [cumulative, setCumulative] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const abortControllerRef = useRef(null);

//   // ✅ Dark mode sync with global (Navbar)
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("theme") === "dark"
//   );
//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       setDarkMode(document.body.classList.contains("dark-mode"));
//     });
//     observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => observer.disconnect();
//   }, []);

//   // 🔹 Send message with streaming
//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage = { sender: "user", text: input };
//     const updatedMessages = [...messages, userMessage];
//     setMessages(updatedMessages);

//     const aiMessage = { sender: "ai", text: "" };
//     setMessages((prev) => [...prev, aiMessage]);

//     setIsLoading(true);
//     abortControllerRef.current = new AbortController();

//     try {
//       const response = await fetch("http://localhost:3000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         signal: abortControllerRef.current.signal,
//         body: JSON.stringify({
//           question: input,
//           grade: currentUser?.Grade || "9",
//           subject,
//           cumulative,
//         }),
//       });

//       if (!response.body) throw new Error("No stream found");

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder("utf-8");
//       let partialText = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         partialText += decoder.decode(value, { stream: true });

//         setMessages((prev) => {
//           const updated = [...prev];
//           updated[updated.length - 1] = { sender: "ai", text: partialText };
//           return updated;
//         });
//       }

//       setChatHistory((prev) =>
//         prev.map((chat) =>
//           chat.id === activeChat.id
//             ? { ...chat, messages: [...updatedMessages, { sender: "ai", text: partialText }] }
//             : chat
//         )
//       );
//     } catch (error) {
//       if (error.name !== "AbortError") {
//         console.error("Streaming error:", error);
//         setMessages((prev) => [
//           ...prev,
//           { sender: "ai", text: "⚠️ Error connecting to AI" },
//         ]);
//       }
//     } finally {
//       setIsLoading(false);
//       setInput("");
//     }
//   };

//   // 🔹 Stop AI response
//   const handleStop = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       setIsLoading(false);
//     }
//   };

//   const handleNewChat = () => {
//     const newChat = { id: Date.now(), name: "New Chat", messages: [] };
//     setChatHistory([newChat, ...chatHistory]);
//     setActiveChat(newChat);
//     setMessages([]);
//   };

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

//   const handleEditChat = (id) => setEditingChatId(id);

//   const handleRename = (id, newName) => {
//     setChatHistory((prev) =>
//       prev.map((chat) =>
//         chat.id === id ? { ...chat, name: newName || "Untitled Chat" } : chat
//       )
//     );
//     setEditingChatId(null);
//   };

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
//           <span className="username">{currentUser?.name || "Guest"}</span>
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
//                   onKeyDown={(e) =>
//                     e.key === "Enter" && handleRename(chat.id, e.target.value)
//                   }
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
//               {msg.sender === "ai" ? (
//                 <Markdown>{msg.text}</Markdown>
//               ) : (
//                 msg.text
//               )}
//             </div>
//           ))}
//           {isLoading && <div className="loading">🤖 Questro is thinking...</div>}
//         </div>

//         {/* Input Area */}
//         <div className="chat-input-area">
//           <select value={subject} onChange={(e) => setSubject(e.target.value)}>
//             <option value="science">science</option>
//             <option value="math">math</option>
//             <option value="physics">physics</option>
//             <option value="chemistry">chemistry</option>
//             <option value="biology">biology</option>
//           </select>

//           <label className="cumulative-checkbox">
//             <input
//               type="checkbox"
//               checked={cumulative}
//               onChange={(e) => setCumulative(e.target.checked)}
//             />
//             Cumulative
//           </label>

//           <input
//             type="text"
//             value={input}
//             placeholder="Type a message..."
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           />

//           <button onClick={handleSend} disabled={isLoading}>
//             {isLoading ? "Thinking..." : "Send"}
//           </button>
//           {isLoading && (
//             <button onClick={handleStop} className="stop-btn">
//               Stop
//             </button>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import api from "../services/api"; // Import centralized API
import "./AIpage.css";


export default function AIChatPage() {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);

  const [subject, setSubject] = useState("science");
  const [cumulative, setCumulative] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const chatContainerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showScrollDown, setShowScrollDown] = useState(false); // ← الجديد

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setCurrentUser(userObj);
      fetchUserChats(userObj.id);
    }
  }, []);

  const fetchUserChats = async (userId) => {
    try {
      const response = await api.get(`/users/userChats?userId=${userId}`);
      const chats = response.data;
      setChatHistory(chats);
      if (chats.length > 0) {
        setActiveChat(chats[0]);
        setMessages(chats[0].messages || []);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  // 🔹 Scroll observer for "Go to Bottom" button ← الجديد
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setShowScrollDown(
        container.scrollTop + container.clientHeight <
          container.scrollHeight - 100
      );
    };

    container.addEventListener("scroll", checkScroll);

    checkScroll();
    return () => container.removeEventListener("scroll", checkScroll);
  }, [messages]);

  const handleSend = async () => {
    setInput("");
    if (!input.trim() || isLoading || !currentUser || !activeChat) return;

    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${api.defaults.baseURL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          question: input,
          grade: currentUser?.Grade || "9",
          subject,
          cumulative,
          userId: currentUser.id,
          chatId: activeChat.chatId || uuidv4(),
        }),
      });

      if (!response.body) throw new Error("No stream found");

      if (response.status === 429) {
        alert("Rate limit reached. Please wait.");
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialText = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialText += decoder.decode(value, { stream: true });

        if (firstChunk) {
          setIsLoading(false);
          firstChunk = false;
          setMessages((prev) => [...prev, { sender: "ai", text: partialText }]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = partialText;
            return updated;
          });
        }
      }

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                messages: [
                  ...updatedMessages,
                  { sender: "ai", text: partialText },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Streaming error:", error);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "⚠️ Error connecting to AI" },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    if (!currentUser) return alert("Please login first!");
    const newChat = {
      id: Date.now(),
      chatId: uuidv4(),
      name: "New Chat",
      messages: [],
    };
    setChatHistory([newChat, ...chatHistory]);
    setActiveChat(newChat);
    setMessages([]);
  };

  const handleDeleteChat = (id) => {
    const filtered = chatHistory.filter((chat) => chat.id !== id);
    setChatHistory(filtered);
    if (activeChat?.id === id && filtered.length > 0) {
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
        chat.id === activeChat?.id ? { ...chat, messages: [] } : chat
      )
    );
  };

  if (!currentUser) {
    return (
      <div
        className={`ai-page login-prompt ${darkMode ? "dark" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          animation: "fadeIn 1.2s ease-in-out",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            marginBottom: "1.2rem",
            color: darkMode ? "#e5e5e5" : "#333",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          {t("Ai.into")}
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: darkMode ? "#bbb" : "#555",
            marginBottom: "2rem",
            maxWidth: "500px",
          }}
        >
          {t("Ai.login")}
        </p>
        <button
          onClick={() => (window.location.href = "/signup")}
          style={{
            padding: "0.8rem 2rem",
            borderRadius: "9999px",
            border: "none",
            background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 0 25px rgba(59, 130, 246, 0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 0 15px rgba(59, 130, 246, 0.6)";
          }}
        >
          {t("Ai.register")}
        </button>

        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
      </div>
    );
  }

  return (
    <div className={`ai-page ${darkMode ? "dark" : ""}`}>
      <aside className="sidebar">
        <div className="user-profile">
          <div className="avatar">👤</div>
          <span className="username">{currentUser?.name || "Guest"}</span>
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
        </div>
      </aside>

      <main className="chat-section">
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.sender === "ai" ? <Markdown>{msg.text}</Markdown> : msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="loading">🤖 Questro is thinking...</div>
          )}
        </div>

        {/* ← زر الذهاب لأسفل */}
        {showScrollDown && (
          <button
            className="scroll-down-btn"
            onClick={() =>
              chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            🡓
          </button>
        )}

        <div className="chat-input-area">
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="science">science/علوم</option>
            <option value="math">math/رياضة</option>
            <option value="arabic">عربي</option>
            <option value="social_studies">دراسات</option>
          </select>

          <label className="cumulative-checkbox">
            <input
              type="checkbox"
              checked={cumulative}
              onChange={(e) => setCumulative(e.target.checked)}
            />
            Cumulative
          </label>

          <input
            type="text"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button onClick={handleSend} disabled={isLoading}>
            {isLoading ? "Thinking..." : "Send"}
          </button>
          {isLoading && (
            <button onClick={handleStop} className="stop-btn">
              Stop
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
