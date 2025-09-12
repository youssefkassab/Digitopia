import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [postFiles, setPostFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [hideUpload, setHideUpload] = useState(false);

  // get current user from localStorage, fallback to "Anonymous"
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;
  const currentUser = storedUser?.name || storedUser?.email || "Anonymous";

  // 🔹 Viewer states
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerFiles, setViewerFiles] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  function openViewer(files, index) {
    setViewerFiles(files);
    setViewerIndex(index);
    setViewerOpen(true);
  }

  function closeViewer() {
    setViewerOpen(false);
    setViewerFiles([]);
    setViewerIndex(0);
  }

  function prevFile(e) {
    e.stopPropagation();
    setViewerIndex((prev) => (prev === 0 ? viewerFiles.length - 1 : prev - 1));
  }

  function nextFile(e) {
    e.stopPropagation();
    setViewerIndex((prev) => (prev === viewerFiles.length - 1 ? 0 : prev + 1));
  }

  async function loadPosts() {
    setPosts([]);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setPostFiles(files);

    if (files.length > 0) {
      const previews = files.map((file) => {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) =>
              resolve({ file, preview: ev.target.result });
            reader.readAsDataURL(file);
          });
        }
        return Promise.resolve({ file, preview: null });
      });

      Promise.all(previews).then((results) => setFilePreviews(results));

      // trigger vanish animation
      setHideUpload(true);
    } else {
      setPostFiles([]);
      setFilePreviews([]);
      setHideUpload(false);
    }
  }

  async function handlePost() {
    if (!postText.trim() && postFiles.length === 0) return;

    const newPost = {
      id: Date.now(),
      username: currentUser,
      text: postText.trim(),
      files: filePreviews, // array of {file, preview}
      likes: 0,
      comments: [],
      time: new Date().toISOString(),
    };

    setPosts((prev) => [...prev, newPost]);
    setPostText("");
    setPostFiles([]);
    setFilePreviews([]);
    setHideUpload(false); // reset upload button after posting
  }

  const [openComments, setOpenComments] = useState({});
  function toggleComments(postId) {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }

  async function likePost(postId) {
    const updated = [...posts];
    const post = updated.find((p) => p.id === postId);
    if (!post) return;

    const likedKey = `${post.id}_${currentUser}`;
    if (likedPosts[likedKey]) return;

    post.likes++;
    setLikedPosts({ ...likedPosts, [likedKey]: true });
    setPosts(updated);
  }

  async function addComment(postId, text) {
    if (!text.trim()) return;
    const updated = [...posts];
    const post = updated.find((p) => p.id === postId);
    if (!post) return;

    post.comments.push({ user: currentUser, text: text.trim() });
    setPosts(updated);
  }

  return (
    <>
      <Helmet>
        <title>Community | 3lm Quest</title>
      </Helmet>
      <div className="community-wrapper">
        <header>
          <div style={{ textAlign: "center" }}>
            <p style={{ marginTop: "1rem" }}>Hi, {currentUser}</p>
          </div>
        </header>

        <main>
          <section className="post-creator">
            <textarea
              className="community_txt_area"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={280}
            />

            {/* Upload Button */}
            <label
              htmlFor="file-upload"
              className={`btn fade-out ${hideUpload ? "hidden" : ""}`}
              style={{ marginTop: "100px", marginRight: "100px" }}
            >
              Choose Files
            </label>
            <input
              id="file-upload"
              type="file"
              accept="*/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {/* Preview media if applicable */}
            {filePreviews.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                {filePreviews.map((item, idx) =>
                  item.file.type.startsWith("image/") ? (
                    <img
                      key={idx}
                      id="previewMedia"
                      src={item.preview}
                      alt="Preview"
                    />
                  ) : item.file.type.startsWith("video/") ? (
                    <video
                      key={idx}
                      id="previewMedia"
                      src={item.preview}
                      controls
                      style={{ maxHeight: "300px" }}
                    />
                  ) : (
                    <p key={idx}>File ready: {item.file.name}</p>
                  )
                )}
              </div>
            )}

            <button id="postBtn" onClick={handlePost}>
              Post
            </button>
          </section>

          <section className="posts-feed">
            {[...posts].reverse().map((post, i) => {
              const likedKey = `${post.id}_${currentUser}`;
              const liked = likedPosts[likedKey];
              return (
                <div
                  key={post.id}
                  className={`post-card ${i === 0 ? "animate-post" : ""}`}
                >
                  <div className="post-header">
                    {post.username || post.user}
                  </div>
                  <div className="post-time">
                    {new Date(post.time).toLocaleString()}
                  </div>
                  <div className="post-content">
                    {post.text}

                    {/* 🔹 Show only first 3 thumbnails */}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {post.files.slice(0, 3).map((item, idx) => {
                        const isLast = idx === 2 && post.files.length > 3;
                        return (
                          <div
                            key={idx}
                            style={{ position: "relative", cursor: "pointer" }}
                            onClick={() => openViewer(post.files, idx)}
                          >
                            {item.file.type.startsWith("image/") ? (
                              <img
                                src={item.preview}
                                alt=""
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : item.file.type.startsWith("video/") ? (
                              <video
                                src={item.preview}
                                style={{
                                  width: "120px",
                                  height: "120px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <p style={{ width: "120px", height: "120px" }}>
                                {item.file.name}
                              </p>
                            )}

                            {isLast && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  background: "rgba(0,0,0,0.6)",
                                  borderRadius: "8px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  color: "#fff",
                                  fontSize: "1.5rem",
                                  fontWeight: "bold",
                                }}
                              >
                                +{post.files.length - 3}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="post-actions">
                    <button disabled={liked} onClick={() => likePost(post.id)}>
                      👍 {post.likes}
                    </button>
                    <button onClick={() => toggleComments(post.id)}>
                      💬 {post.comments.length}
                    </button>
                  </div>
                  {openComments[post.id] && (
                    <div className="comments-container">
                      {post.comments.map((c, idx) => (
                        <div key={idx} className="comment">
                          <strong>{c.user}</strong>: {c.text}
                        </div>
                      ))}
                      <div className="comment-input">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addComment(post.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            addComment(post.id, input.value);
                            input.value = "";
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </main>

        {/* 🔹 Fullscreen viewer with arrows */}
        {viewerOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={closeViewer}
          >
            {/* Left Arrow */}
            <button
              onClick={prevFile}
              style={{
                position: "absolute",
                left: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "2.5rem",
                cursor: "pointer",
              }}
            >
              ‹
            </button>

            {viewerFiles[viewerIndex].file.type.startsWith("image/") ? (
              <img
                src={viewerFiles[viewerIndex].preview}
                alt=""
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: "10px",
                }}
              />
            ) : viewerFiles[viewerIndex].file.type.startsWith("video/") ? (
              <video
                src={viewerFiles[viewerIndex].preview}
                controls
                autoPlay
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <p style={{ color: "white" }}>
                {viewerFiles[viewerIndex].file.name}
              </p>
            )}

            {/* Right Arrow */}
            <button
              onClick={nextFile}
              style={{
                position: "absolute",
                right: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "2.5rem",
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
}
