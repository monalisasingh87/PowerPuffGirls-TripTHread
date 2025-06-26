import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { feature } from "topojson-client";
import { fetchMapData } from "../FetchMap";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { isoNumericToAlpha3 } from "../mappingfile";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';



const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";


export const WorldMap = () => {
    const { store, dispatch } = useGlobalReducer();
    const [geographies, setGeographies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadMap = async () => {
            const res = await fetch(geoUrl);
            const data = await res.json();
            const countries = feature(data, data.objects.countries).features;
            setGeographies(countries);
        };
        loadMap();
    }, []);

    const handleCountryClick = (geo) => {
		const name = geo.properties.name;
        fetchMapData(geo.properties.ISO_A3, dispatch);
		navigate(`/country/${name}`);
	};

    const generateTooltipContent = (geo) => {
        const info = store.hoverCountryInfo;
        const name = geo.properties.name;
        if(!info || info.name !== name) return name;

        const currency = info.currency || 'N/A';
        const languages = Array.isArray(info.languages) ? info.languages.join(', '): 'N/A';

        return (
            <div>
                <strong>{name}</strong><br />
                Currency: {currency}<br />
                Language: {languages}
            </div>
        );
    };


    return(
    <>
    <div style={{ height: "100vh", width: "100%" }}>
        <ComposableMap>
            <Geographies geography={geoUrl}>
                {({ geographies}) =>
                    geographies.map((geo) => (
                    <Tippy
                        key={geo.rsmKey}
                        content={generateTooltipContent(geo)}
                        delay={[200, 0]}
                        interactive={true}
                        placement="top"
                    >
                        <div>
                            <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => {
                                const alpha3 = isoNumericToAlpha3[geo.id?.toString().padStart(3, "0")];
                                if (alpha3) fetchMapData(alpha3, dispatch);
                            }}
                            onClick={() => handleCountryClick(geo)}
                            style={{
                                default: { fill: "#D6D6DA", outline: "none" },
                                hover: { fill: "#F53", outline: "none" },
                                pressed: { fill: "#E42", outline: "none" },
                            }}
                            tabIndex="0"
                            />
                        </div>
                    </Tippy>
                    ))
                }
            </Geographies>
        </ComposableMap>
    </div>
    </>
    );
};

