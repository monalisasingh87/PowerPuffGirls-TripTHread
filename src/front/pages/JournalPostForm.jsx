import { useState } from "react";
import { createPost, uploadImage } from "../../api";
import { useAuth } from "../hooks/useAuth";
import "./JournalPostForm.css";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useNavigate } from "react-router-dom";


export const JournalPostForm = () => {
  const {store, dispatch} = useGlobalReducer();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("")
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user }  = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    alert("You must be logged in to create a post.");
    return;
  }

  setIsSubmitting(true);
  try {
    const formattedContent = `(Author: ${author || "Anonymous"})\n${content}`;

    const postResponse = await createPost({ title, content: formattedContent });
    const postId = postResponse.id;

    await Promise.all(images.map((img) => uploadImage(postId, img)));

    setTitle("");
    setAuthor("");
    setContent("");
    setImages([]);
    alert("Your Post is created!");
    console.log("Redirecting to /journals...");
    navigate("/journals");
    console.log("Should be redirected.");
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while creating your Post.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
    {!store.loggedIn ?
      <h1>
        You must be logged in to view this page
      </h1>:
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
        Author
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name(optional)"
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
    }
    </>
  );
};