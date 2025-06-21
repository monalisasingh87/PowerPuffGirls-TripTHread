import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { feature } from "topojson-client";
import { fetchMapData } from "../FetchMap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import useGlobalReducer from "../hooks/useGlobalReducer"



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

    useEffect(() => {
	const timeout = setTimeout(() => {
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		[...tooltipTriggerList].forEach(el => {
			const tooltip = window.bootstrap.Tooltip.getInstance(el);
			if (tooltip) tooltip.dispose(); // Remove old instance
			new window.bootstrap.Tooltip(el, { html: true });
		});
	}, 100); // slight delay to ensure DOM has updated

	return () => clearTimeout(timeout);
}, [store.hoverCountryInfo]);


    const handleCountryClick = (geo) => {
		const name = geo.properties.name;
        fetchMapData(name, dispatch);
		navigate(`/country/${name}`);
	};


    return(
    <>
        <ComposableMap>
            <Geographies geography={geoUrl}>
                {({ geographies}) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => fetchMapData(geo.properties.name, dispatch)} // 👈 Fetch on hover
                            onClick={() => handleCountryClick(geo)}
                            style={{
                                default: { fill: "#D6D6DA", outline: "none" },
								hover: { fill: "#F53", outline: "none" },
								pressed: { fill: "#E42", outline: "none" },
                            }}
                            tabIndex="0" // necessary for Bootstrap tooltip to work on SVGs
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={
                                    store.hoverCountryInfo && geo.properties.name === store.hoverCountryInfo.name
                                        ? `${geo.properties.name}<br/>
                                        <img src="${store.hoverCountryInfo.flag}" width="20" />
                                        Currency: ${store.hoverCountryInfo.currency}<br/>
                                        Local Time: ${new Date(store.hoverCountryInfo.time).toLocaleTimeString()}`
                                        : geo.properties.name
                                    }
                        />
                    ))
                }
            </Geographies>
        </ComposableMap>
    </>
    )
};