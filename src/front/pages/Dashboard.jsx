import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error("Failed to load your posts.");
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [navigate, token]);

  const handleCreatePost = () => {
    navigate("/create");
  };

  if (loading) return <p>Loading...</p>;


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Travel Journal</h1>
        <button onClick={handleCreatePost}>+ New Post</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {posts.length === 0 ? (
        <p className="no-posts">You haven't posted anything yet.</p>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-author">by {post.username}</p>

              {post.images?.length > 0 && (
                <div className="post-image-wrapper">
                  <img
                    src={post.images[0].image_url}
                    alt="Post visual"
                    className="post-image"
                  />
                </div>
              )}

              <p className="post-content">{post.content.slice(0, 150)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

