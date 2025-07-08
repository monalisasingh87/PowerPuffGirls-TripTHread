import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import { SearchBar } from "../components/SearchBar.jsx";
import { useLocation } from "react-router-dom";


export const Destination = () => {
    const [location, setLocation] = useState(null);
    const { store, dispatch } = useGlobalReducer();
    const isInWishlist = location ? store.wishlist.some(item => item.title === location.title) : false;
    const { state } = useLocation();
    const passedCountry = state?.countryName;


    useEffect(() => {
    const fetchLocation = async () => {
        if (!passedCountry) return;
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(passedCountry)}`;
        try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Page not found");
        const data = await response.json();
        const validPlaceKeyWords = ['city', 'mountain', 'country', 'river', 'lake', 'capital', 'state', 'borough', 'region', 'island'];
        const isValid = validPlaceKeyWords.some(keyword => data.extract.toLowerCase().includes(keyword));
        if ((data.type === "Internal error") || (data.status === 404) || (!isValid)) {
            throw new Error("Invalid content");
        }
        setLocation(data);
        } catch (error) {
        console.error("Error fetching location:", error);
        setLocation(null);
        }
    };
    fetchLocation();
    }, [passedCountry]);


    return (
        <div className="destination">
            <div className="search-bar-container">

                <SearchBar setLocation={setLocation} />

            </div>
            <div className="row">
                <div className="col-2"></div>
                <div className="locationTitleAndImg col-8">
                    <div className="description-header d-flex justify-content-around">
                        <div className="title">
                            {location ? (<div className="wishlist-title"><h1>{location.title}</h1>
                                <div className="heart-block">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25" height="25" fill={isInWishlist ? "orange" : "grey"}
                                        className="bi bi-heart-fill" viewBox="0 0 16 16"
                                        onClick={() => {
                                            if (!store.isLoginSuccessful) return alert("Please Log in to add to wishlist")
                                            if (!location) return;
                                            if (!isInWishlist && location) { dispatch({ type: "AddToWishlist", payload: location }); }
                                            else { dispatch({ type: "RemoveFromWishlist", payload: location }) }
                                        }}
                                    >
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                    </svg>
                                    <h6>add to your wishlist</h6>
                                </div>
                            </div>
                            ) : (<h1>Search a place above</h1>)}

                            {location ? (<p>{location.extract}</p>) : (<p>The description is loading...</p>)}
                        </div>
                        <div className="sampleImage">
                            {location && location.originalimage ? <img src={location.originalimage.source} alt={`Image of ${location.title}`} /> : <p>image cannot open</p>}
                        </div>

                    </div>
                </div>
                <div className="col-2"></div>
            </div>

        </div>
    )
}