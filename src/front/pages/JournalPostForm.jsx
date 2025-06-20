import { useState } from "react";
import { createPost, uploadImage } from "../../api";
import { useAuth } from "../hooks/useAuth";

export const JournalPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    createPost({ title, content, user_id: user.id })
      .then((postResponse) => {
        const postId = postResponse.id;

        return Promise.all(
          images.map((img) => uploadImage(postId, img))
        );
      })
      .then(() => {
        // Reset form
        setTitle("");
        setContent("");
        setImages([]);
        alert("Post created!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong while creating the post.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        required
      />
      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files])}
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

