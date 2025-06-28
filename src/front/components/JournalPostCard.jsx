import React from "react";

export const JournalPostCard = ({ title, content, username, created_at }) => {
  const date = new Date(created_at).toLocaleDateString();

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          By {username} on {date}
        </h6>
        <p className="card-text">{content.slice(0, 150)}...</p>
      </div>
    </div>
  );
};
