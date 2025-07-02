import React from "react"
import { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer";


export const SearchBar = ({ setLocation }) => {
    const [inputvalue, setInputValue] = useState("");
    const { store, dispatch } = useGlobalReducer();


    const fetch_location = async () => {

        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(inputvalue)}`;
        try {
            const response = await fetch(url);
            // const data = await response.json();
            if (!response.ok) {
                throw new Error("Page not found");
            }
            const data = await response.json();

            const validPlaceKeyWords = ['city', 'mountain', 'country', 'river', 'lake', 'capital', 'state', 'borough', 'region', 'island'];
            const isValid = validPlaceKeyWords.some(keyword => data.extract.toLowerCase().includes(keyword));
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
                    placeholder="Type a city or landmark you interested in..."
                    className="search-bar-input"
                    value={inputvalue}
                    onChange={e => setInputValue(e.target.value)}
                />

            </div>

            <button
                className="btn btn-secondary search-button"
                onClick={fetch_location}
            >Search</button>

            <div className="dropdown">
                <a className="btn dropdown-toggle"
                    href="#" role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={(e) => e.preventDefault()}
                >
                    Wishlist
                </a>

                <ul className="dropdown-menu">

                    {store.wishlist.length === 0 ? (<li><span>Add your interested location</span></li>) : (store.wishlist.map((item, index) =>
                        <li key={index} className="dropdown-item">
                            <h5
                                onClick={() => setLocation(item)}>{item?.title || "Unnamed Location"}</h5>
                            <button
                                className="delete"
                                onClick={() => { dispatch({ type: "RemoveFromWishlist", payload: item }) }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16" height="16" fill="currentColor"
                                    className="bi bi-trash" viewBox="0 0 16 16"
                                >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </button>
                        </li>

                    ))}

                </ul>
            </div>
        </div>
    )
}