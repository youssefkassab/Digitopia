
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
import "./AIPage.css";

export default function AIChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);

  const [subject, setSubject] = useState("science");
  const [cumulative, setCumulative] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const abortControllerRef = useRef(null);

  // ✅ Dark mode sync
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ✅ Load current user from localStorage on mount
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
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/users/userChats?userId=${userId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.ok) {
        const chats = await res.json();
        setChatHistory(chats);
        if (chats.length > 0) {
          setActiveChat(chats[0]);
          setMessages(chats[0].messages || []);
        }
      } else {
        console.error("Failed to fetch chats", res.status);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  // 🔹 Send message with streaming
  const handleSend = async () => {
    setInput("");
    if (!input.trim() || isLoading || !currentUser || !activeChat) return;

    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // const aiMessage = { sender: "ai", text: "" };
    // setMessages((prev) => [...prev, aiMessage]);

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("http://localhost:3000/ask", {
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

          // هنا أول ما ييجي chunk ضيف aiMessage 
          setMessages((prev) => [...prev, { sender: "ai", text: partialText }]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = partialText;
            return updated;
          });
        }
      }

      // Update chat history locally
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, messages: [...updatedMessages, { sender: "ai", text: partialText }] }
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
      // setInput("");
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
    const newChat = { id: Date.now(), chatId: uuidv4(), name: "New Chat", messages: [] };
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
      prev.map((chat) => (chat.id === id ? { ...chat, name: newName || "Untitled Chat" } : chat))
    );
    setEditingChatId(null);
  };

  const clearMessages = () => {
    setMessages([]);
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === activeChat?.id ? { ...chat, messages: [] } : chat))
    );
  };

  // ✅ Show login prompt if no user
  if (!currentUser) {
    return (
      <div className={`ai-page login-prompt ${darkMode ? "dark" : ""}`}>
        <div className="login-message">
          Please login or signup to use the AI chat.
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-page ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
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
              className={`chat-history-item ${activeChat?.id === chat.id ? "active" : ""}`}
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
                  onKeyDown={(e) => e.key === "Enter" && handleRename(chat.id, e.target.value)}
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

      {/* Main Chat Section */}
      <main className="chat-section">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender === "user" ? "user" : "ai"}`}>
              {msg.sender === "ai" ? <Markdown>{msg.text}</Markdown> : msg.text}
            </div>
          ))}
          {isLoading && <div className="loading">🤖 Questro is thinking...</div>}
        </div>

        <div className="chat-input-area">
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="science">science</option>
            <option value="math">math</option>
            <option value="physics">physics</option>
            <option value="chemistry">chemistry</option>
            <option value="biology">biology</option>
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