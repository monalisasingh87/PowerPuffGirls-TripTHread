const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // 🔁 change if your backend is hosted elsewhere

// Create a new post (POST /posts)
export const createPost = async (postData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.statusText}`);
  }

  return await response.json();
};

export const uploadImage = async (postId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/images`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`);
  }

  return await response.json();
};

// Get all posts (GET /api/posts)
export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/posts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  return await response.json();
};