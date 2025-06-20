import { useEffect, useState } from "react";
import { getPosts } from "../../api";

export const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id} style={{border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem'}}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p><i>by {post.user.username}</i></p>
          {post.images.map(img => (
            <img key={img.id} src={img.image_url} alt="Post" width="200" />
          ))}
        </div>
      ))}
    </div>
  );
}


