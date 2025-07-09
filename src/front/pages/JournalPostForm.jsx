import { useState } from "react";
import { createPost, uploadImage } from "../../api";
import { useAuth } from "../hooks/useAuth";
import "./JournalPostForm.css";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useNavigate } from "react-router-dom";


export const JournalPostForm = () => {
  const { store, dispatch } = useGlobalReducer();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("")
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage("You must be logged in to create a post.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const postData = {
        title,
        content,
       // author: author || "Anonymous"
      };

      console.log("Submitting post data:", postData);

      const postResponse = await createPost(postData);
      const postId = postResponse.id;

      localStorage.setItem(`post-author-${postId}`, author || "Anonymous");

      await Promise.all(images.map((img) => uploadImage(postId, img)));

      setTitle("");
      setAuthor("");
      setContent("");
      setImages([]);
      setSuccessMessage("Your Post is created!Redirecting...");
      setTimeout(() => {
        navigate(`/journal/${postId}`);
      }, 2000);
      console.log("Should be redirected.");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong while creating your Post.");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!store.loggedIn ? (
        <div className="alert-box alert-error">
          You must be logged in to view this page.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="journal-form">
          <h2 className="form-title">Create a Journal Post</h2>

          {errorMessage && (
            <div className="alert-box alert-error">{errorMessage}</div>
          )}

          {successMessage && (
            <div className="alert-box alert-success">{successMessage}</div>
          )}

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
            -   </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Post"}
          </button>
        </form>
      )}
    </>
  );
};