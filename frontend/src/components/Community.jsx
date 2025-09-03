import React, { useState, useEffect } from "react";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [likedPosts, setLikedPosts] = useState({});
  const currentUser = "Anonymous";

  // Fake loader — just clears posts
  async function loadPosts() {
    // Backend removed: would fetch("") here
    setPosts([]);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setPostImage(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  }

  // Create a new post locally (no server)
  async function handlePost() {
    if (!postText.trim() && !postImage) return;

    const newPost = {
      id: Date.now(),
      username: currentUser,
      text: postText.trim(),
      image: imagePreview || null,
      likes: 0,
      comments: [],
      time: new Date().toISOString(),
    };

    setPosts((prev) => [...prev, newPost]);
    setPostText("");
    setPostImage(null);
    setImagePreview("");

    // Backend removed: would POST to "" here
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

    // Backend removed: would PUT to "" here
  }

  async function addComment(postId, text) {
    if (!text.trim()) return;
    const updated = [...posts];
    const post = updated.find((p) => p.id === postId);
    if (!post) return;

    post.comments.push({ user: currentUser, text: text.trim() });
    setPosts(updated);

    // Backend removed: would PUT to "" here
  }

  return (
    <div className="community-wrapper">
      <style>{`
        @keyframes fadeSlideIn {from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .animate-post {animation: fadeSlideIn 0.4s ease-out;}
        .post-creator {text-align:center;margin:2rem auto;max-width:900px;}
        .post-creator textarea {width:100%;height:100px;padding:1rem;border-radius:12px;border:1px solid #ccc;resize:none;font-size:1rem;transition:box-shadow 0.3s ease;}
        .post-creator textarea:focus {box-shadow:0 0 10px #007bff;outline:none;}
        #postBtn {margin-top:1rem;padding:0.5rem 1.5rem;border:none;background-color:#007bff;color:white;font-size:1rem;border-radius:8px;cursor:pointer;transition:background-color 0.3s ease;}
        #postBtn:hover {background-color:#0056b3;}
        .posts-feed {max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem;padding-bottom:4rem;}
        .post-card {background-color:#fff;padding:1rem 1.5rem;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:transform 0.3s ease;}
        .post-card:hover {transform:scale(1.01);}
        .post-header {font-weight:bold;margin-bottom:0.5rem;}
        .post-time {color:gray;font-size:0.85rem;}
        .post-content {margin:1rem 0;white-space:pre-wrap;}
        .post-actions {display:flex;gap:1rem;align-items:center;}
        .post-actions button {background:none;border:none;cursor:pointer;color:#007bff;transition:transform 0.2s ease;}
        .post-actions button:hover {transform:scale(1.1);}
        .comments-container {margin-top:1rem;padding-left:1rem;border-left:2px solid #ddd;display:flex;flex-direction:column;gap:0.5rem;animation:fadeSlideIn 0.3s ease forwards;}
        .comment {background:#f9f9f9;padding:0.5rem 1rem;border-radius:8px;}
        .comment-input {display:flex;gap:0.5rem;margin-top:0.5rem;}
        .comment-input input {flex:1;padding:0.5rem;border:1px solid #ccc;border-radius:8px;}
        .comment-input button {padding:0.5rem 1rem;background-color:#007bff;border:none;color:white;border-radius:8px;cursor:pointer;}
        #imagePreview {display:block;margin-top:1rem;max-width:100%;border-radius:10px;}
      `}</style>

      <header>
        <div style={{ textAlign: "center" }}>
          <p style={{ marginTop: "1rem" }}>Hi, {currentUser}</p>
        </div>
      </header>

      <main>
        <section className="post-creator">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={280}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "1rem" }}
          />
          {imagePreview && (
            <img id="imagePreview" src={imagePreview} alt="Preview" />
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
                <div className="post-header">{post.username || post.user}</div>
                <div className="post-time">
                  {new Date(post.time).toLocaleString()}
                </div>
                <div className="post-content">
                  {post.text}
                  {post.image && (
                    <img
                      src={post.image} // already base64 or local preview
                      style={{
                        maxWidth: "100%",
                        marginTop: "1rem",
                        borderRadius: "8px",
                      }}
                      alt=""
                    />
                  )}
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
    </div>
  );
}
