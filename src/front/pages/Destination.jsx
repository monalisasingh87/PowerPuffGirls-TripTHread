import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";





export const Destination = () => {

 const initial_city = {
    "title": "",
    "extract": "",
    "timestamp": ""

 }


 useEffect(() => {
     if (!location) return;
  const fetch_location = async() => {
   
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`;
    try {
        const response = await fetch(url);
        // const data = await response.json();
        if(!response.ok) {
            throw new Error("Something is wrong fetching url to get info");
        }
           const data = await response.json();
           
    } catch (error) {
        
    }

  }

 },[])


    return (
        <>
            {/* <Input
                placeholder="type a city or landermarks you interested"
                type="text"
                value=""
            /> */}
            {/* <button onclick={direct_to_detination}>Go</button> */}
            show the cities..

        </>
    )
}