import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./JournalPostDetail.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const JournalPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setCurrentUserId(userId ? parseInt(userId, 10) : null);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/journals/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this journal post.");
      }
    };

    fetchPost();
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!post) return <p>Loading...</p>;

  const isOwner = currentUserId === post.user?.id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/journals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      alert("Post deleted!");
      navigate("/journals");
    } catch (err) {
      console.error(err);
      alert("Error deleting post.");
    }
  };

  return (
    <div className="journal-detail-container">
      <h1 className="journal-detail-title">{post.title}</h1>
      <h6 className="journal-detail-meta">
        By {localStorage.getItem(`post-author-${id}`) || "Anonymous"} on{" "}
        {new Date(post.created_at).toLocaleDateString()}
      </h6>
      <hr />
      {post.images && post.images.length > 0 && (
        <div className="journal-detail-images">
          {post.images.map((img, index) => (
            <img
              key={index}
              src={img.image_url}
              alt={`journal-img-${index}`}
              className="journal-image"
            />
          ))}
        </div>
      )}
      <p className="journal-detail-content">{post.content}</p>

      {isOwner && (
        <div className="journal-detail-actions">
          <Link to={`/journal/${id}/edit`} className="btn btn-primary me-2">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};


