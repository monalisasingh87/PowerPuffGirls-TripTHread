import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { feature } from "topojson-client";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { countryInfo } from "../CountryInfo";


const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";


export const WorldMap = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // State to track hovered country and mouse position
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleCountryClick = (geo) => {
  const countryName = geo.properties.name;
  navigate("/destination", { state: { countryName } });
};

  const getTooltip = (geo) => {
    const name = geo.properties.name;
    const info = countryInfo[name];
    if (!info) return (<strong>{name}</strong>);
    return (
      <div>
        <strong>{name}</strong><br />
        Currency: {info.currency}<br />
        Language: {info.language}
      </div>
    );
  };


  return (
    <>
      <div 
          className="container"
          style={{  position: "relative", 
                    backgroundImage: "url('src/front/assets/img/background2.jpg')",
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                 }}>
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleCountryClick(geo)}
                  fill="#1E1E57"
                  stroke="rgb(50, 48, 95)"
                  onMouseEnter={e => {
                    setHoveredCountry(geo);
                    setMousePos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{
                    default: { fill: "#F3F2F7", outline: "none" },
                    hover: { fill: "#FF6B00", outline: "none" },
                    pressed: { fill: "#E42", outline: "none" },
                  }}
                  tabIndex="0"
                />
              ))
            }
          </Geographies>
        </ComposableMap>
        {hoveredCountry && (
          <div
            style={{
              position: "fixed",
              left: mousePos.x + 10,
              top: mousePos.y + 10,
              background: "rgba(252, 252, 252, 0.9)",
              color: "black",
              padding: "8px 12px",
              borderRadius: "4px",
              pointerEvents: "none",
              zIndex: 1000,
              minWidth: 120
            }}
          >
            {getTooltip(hoveredCountry)}
          </div>
        )}
      </div>
    </>
  )
};