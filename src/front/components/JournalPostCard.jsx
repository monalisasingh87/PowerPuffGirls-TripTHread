import React from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const JournalPostCard = ({ id, title, content, username, created_at, images = [] }) => {
  const date = new Date(created_at).toLocaleDateString();
  const author = username || "Anonymous";

  const preview =
    content.length > 50 ? `${content.slice(0, 150)}...` : content;

  return (
    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
      {images.length > 0 && (
        <img
          src={images[0].image_url}
          alt="Post"
          className="card-img-top"
          style={{
            maxHeight: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />
      )}

      <div className="card-body p-4">
        <h4 className="card-title mb-2">{title}</h4>

        <p className="text-muted mb-2" 
           style={{ fontSize: "0.9rem" }}>
          By {author} on {date}
        </p>

        <p className="card-text mb-4" 
           style={{ fontSize: "1rem", color: "#444" }}>
          {preview}
        </p>

        <Link
          to={`/journal/${id}`} 
          className="btn btn-primary mt-2"
          style={{ backgroundColor: "#0069b4", color: "#fff", border: "none" }}
        >
         Read More →
        </Link>
      </div>
    </div>
  );
};

export default JournalPostCard;
