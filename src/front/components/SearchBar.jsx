import React from "react"
import { useState } from "react"

export const SearchBar = ({ setLocation }) => {
    const [inputvalue, setInputValue] = useState("");
    const fetch_location = async () => {

        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(inputvalue)}`;
        try {
            const response = await fetch(url);
            // const data = await response.json();
            if (!response.ok) {
                throw new Error("Page not found");
            }
            const data = await response.json();

            const validPlaceKeyWords = ['city', 'mountain', 'country', 'river', 'lake', 'capital', 'state'];
            const isValid = validPlaceKeyWords.some(keyword => data.description.toLowerCase().includes(keyword));
            if ((data.type === "Internal error") || (data.status === 404) || (!isValid)) {
                throw new Error("Something went wrong. Please enter a valid place.");
            }
            setLocation(data);


        } catch (error) {
            console.log("error fetching location", error);
            setLocation(null);
        }

    }


    return (
        <div className="search-part">
            <div className="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search search-icon" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input
                    placeholder="Type a city or landmark you interested..."
                    className="search-bar-input"
                    value={inputvalue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={fetch_location}

                />

            </div>

            <button
                className="btn btn-secondary search-button"
                onClick={fetch_location}
            >Search</button>
        </div>
    )
}