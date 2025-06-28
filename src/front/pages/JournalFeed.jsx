import React, { useEffect, useState } from "react";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const JournalFeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/journals`);
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">Journal Posts</h2>
            <div className="row">
                {posts.map((post) => (
                    <div className="col-12 col-md-6 col-lg-4 mb-4" key={post.id}>
                        <JournalPostCard
                            title={post.title}
                            content={post.content}
                            username={post.username}
                            created_at={post.created_at}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default JournalFeed;