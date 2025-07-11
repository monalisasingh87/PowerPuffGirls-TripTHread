import { useState } from "react";
import { createPost, uploadImage } from "../../api";
import { useAuth } from "../hooks/useAuth";
//import "./JournalPostForm.css";
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
      setSuccessMessage("Your Post is created! Redirecting...");
      setTimeout(() => {
        navigate(`/journal/${postId}`);
      }, 4000);
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
        <div 
          className="alert-box alert-error"
          style={{
            padding: "10px 15px",
            borderRadius: 5,
            marginBottom: 15,
            fontWeight: "bold",
            border: "1px solid #cc0033",
            backgroundColor: "#ffe6ea",
            color: "#cc0033",
          }}
        >
          You must be logged in to view this page.
        </div>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          className="journal-form"
          style={{
            backgroundColor: "white",
            maxWidth: 600,
            width: "100%",
            padding: "2rem",
            borderRadius: 16,
            margin: "100px auto",
            //boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            //animation: "fadeIn 0.5s ease-in",
          }}
        >
          <h2 
            className="form-title"
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "1.5rem",
              color: "#333",
            }}
          >
            Create a Journal Post
          </h2>

          {errorMessage && (
            <div 
              className="alert-box alert-error"
              style={{
                padding: "10px 15px",
                borderRadius: 5,
                marginBottom: 15,
                fontWeight: "bold",
                border: "1px solid #cc0033",
                backgroundColor: "#ffe6ea",
                color: "#cc0033",
              }}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div 
              className="alert-box alert-success"
              style={{
                padding: "10px 15px",
                borderRadius: 5,
                marginBottom: 15,
                fontWeight: "bold",
                border: "1px solid #cc0033",
                backgroundColor: "#ffe6ea",
                color: "#cc0033",
              }}
            >
              {successMessage}
            </div>
          )}

          <label
            style={{
              display: "block",
              marginBottom: "1.25rem",
              color: "#444",
              fontWeight: 500,
            }}
          >
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: 8,
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
            /> 
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "1.25rem",
              color: "#444",
              fontWeight: 500,
            }}
          >
            Author
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name(optional)"
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: 8,
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
              }}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "1.25rem",
              color: "#444",
              fontWeight: 500,
            }}
          >
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages([...e.target.files])}
              style={{ marginTop: "0.5rem" }}
            />
          </label>

          {images.length > 0 && (
            <div 
            className="image-preview"
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "1rem",
              }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${idx}`}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
              ))}
            </div>
          )}

          <label
            style={{
              display: "block",
              marginBottom: "1.25rem",
              color: "#444",
              fontWeight: 500,
            }}
          >
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here..."
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: 8,
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "border-color 0.3s",
                resize: "vertical",
                minHeight: 150,
              }}
            />
          </label>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.9rem",
              backgroundColor: isSubmitting ? "#ccc" : "#c99404",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: 10,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background 0.3s",
            }}
          >
            {isSubmitting ? "Submitting..." : "Create Post"}
          </button>
        </form>
      )}
    </>
  );
};