import { useState } from "react";
import { createPost, uploadImage } from "../../api";
import { useAuth } from "../hooks/useAuth";
import "./JournalPostForm.css";

export const JournalPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    alert("You must be logged in to create a post.");
    return;
  }

  setIsSubmitting(true);
  try {
    // Only send title and content — no user_id here
    const postResponse = await createPost({ title, content });
    const postId = postResponse.id;

    await Promise.all(images.map((img) => uploadImage(postId, img)));

    setTitle("");
    setContent("");
    setImages([]);
    alert("Post created!");
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while creating the post.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="journal-form">
      <h2 className="form-title">Create a Journal Post</h2>

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title"
          required
        />
      </label>

      <label>
        Upload Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />
      </label>

      {images.length > 0 && (
        <div className="image-preview">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(img)}
              alt={`preview-${idx}`}
            />
          ))}
        </div>
      )}

      <label>
        Content
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your story here..."
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Create Post"}
      </button>
    </form>
  );
};