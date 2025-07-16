import React, { useEffect, useState } from "react";
import JournalPostCard from "../components/JournalPostCard"; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const JournalFeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/journals`);
                const data = await res.json();
                console.log("Journal feed data:", data);
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="bg-img" style={{  
                    position: "relative", 
                    backgroundImage: "url('src/front/assets/img/background2.jpg')",
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                 }}>
        <div className="container py-4">
            <h2 className="text-center mb-4 text-light">Journal Posts</h2>
            <div className="row">
                {posts.map((post) => {
                    // Extract author from the first line of content
                    const match = post.content.match(/^\(Author:\s*(.*?)\)/);
                    const author = match ? match[1] : "Anonymous";
                    const cleanedContent = post.content.replace(/^\(Author:\s*.*?\)\n?/, "");

                    return (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={post.id}>
                            <JournalPostCard
                                id={post.id}
                                title={post.title}
                                content={cleanedContent}
                                username={author}
                                created_at={post.created_at}
                                images={post.images}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
    );
};
