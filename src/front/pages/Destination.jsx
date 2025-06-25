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
            <div className="row mt-4">
                <div className="col-2"></div>
                <div className="locationTitleAndImg col-8">
                    <div className="description-header d-flex justify-content-around">
                        <div className="title">
                            {location ? (<h1>{location.title}</h1>) : (<h1>Search a place above</h1>)}
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