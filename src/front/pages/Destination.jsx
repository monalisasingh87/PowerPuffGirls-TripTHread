import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import { SearchBar } from "../components/SearchBar.jsx"





export const Destination = () => {
    const [location, setLocation] = useState(null)



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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="orange" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                    </svg><h6>add to your wishlist</h6>
                                </div>
                            </div>
                            ) : (<h1>Search a place above</h1>)}

                            {location ? (<p>{location.extract}</p>) : (<p>The description is loading...</p>)}
                        </div>
                        <div className="sampleImage">
                            {location ? <img src={location.originalimage.source} alt="samplePiture" /> : <p>image cannot open</p>}
                        </div>

                    </div>
                </div>
                <div className="col-2"></div>
            </div>

        </div>
    )
}