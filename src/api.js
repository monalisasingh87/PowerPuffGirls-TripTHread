const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const USE_AUTH = true; 

// Create a new journal post 
export const createPost = async (postData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/journals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create post: ${error?.msg || response.statusText}`);
  }

  return await response.json();
};

// Upload an image to a journal post 
export const uploadImage = async (postId, imageFile) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}/images`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}` 
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to upload image: ${error?.msg || response.statusText}`);
  }

  return await response.json();
};

// Get all journal posts 
export const getPosts = async () => {
 const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/journals`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch posts: ${error?.msg || response.statusText}`);
  }

  return await response.json();
};

// Edit a journal post 
export const updatePost = async (postId, updatedData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update post: ${error?.msg || response.statusText}`);
  }

  return await response.json();
};

// Delete a journal post 
export const deletePost = async (postId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete post: ${error?.msg || response.statusText}`);
  }

  return await response.json();
};

// Delete a specific image from post
export const deleteImage = async (postId, imageId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/api/journals/${postId}/images/${imageId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete image: ${error?.msg || response.statusText}`);
  }

  return await response.json();
};
