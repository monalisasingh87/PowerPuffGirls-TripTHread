import React, { useState } from 'react'

const JournalForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2>Post A Journal</h2>

            <label htmlFor="title">Title</label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px'
                }}
            />

            <label htmlFor="content">Content</label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{
                    width: '100%',
                    padding: '8px',
                    height: '100px',
                    marginBottom: '10px'
                }}
            />

            <button type="submit">Post</button>
        </form>
    );
};

export default JournalForm;
