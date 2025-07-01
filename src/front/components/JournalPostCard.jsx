import React from "react";

const JournalPostCard = ({ title, content, username, created_at }) => {
  const date = new Date(created_at).toLocaleDateString();
  const author = username || "Anonymous";

  const preview =
    content.length > 150 ? `${content.slice(0, 150)}...` : content;

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          By {author} on {date}
        </h6>
        <p className="card-text">{preview}</p>
      </div>
    </div>
  );
};
export default JournalPostCard;
