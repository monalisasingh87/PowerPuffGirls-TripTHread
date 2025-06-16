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
                <div>
                    <div className="locationTitleAndImg">
                        {location ? (<h1>location.title</h1>) : (<p>Search a place above</p>)}
                    </div>
                </div>
            </div>
        </div>
    )
}