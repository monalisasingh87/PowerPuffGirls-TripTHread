const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn(" No auth token found in localStorage");
    return {};
  }

  return {
    "Authorization": `Bearer ${token}`,
  };
};

// Create post
export const createPost = async ({ title, content }) => {
  console.log("Creating post with data:", { title, content });
  if (!title || !content) {
    throw new Error("Missing title or content in request.");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/journals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to create post:", text);
    throw new Error(`Failed to create post: ${text}`);
  }

  const json = await response.json();
  console.log("Post created successfully:", json); 
  return json;
};

// Upload image
export const uploadImage = async (postId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}/images`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload image: ${text}`);
  }

  return await response.json();
};

// Fetch all posts
export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/journals`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch posts: ${text}`);
  }

  return await response.json();
};

// Edit post
export const updatePost = async (postId, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update post: ${text}`);
  }

  return await response.json();
};

// Delete post
export const deletePost = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to delete post: ${text}`);
  }

  return await response.json();
};

// Delete image
export const deleteImage = async (postId, imageId) => {
  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}/images/${imageId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to delete image: ${text}`);
  }

  return await response.json();
};
