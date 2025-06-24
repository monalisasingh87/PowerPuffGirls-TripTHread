import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { feature } from "topojson-client";
import { fetchMapData } from "../FetchMap";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { isoNumericToAlpha3 } from "../mappingfile";



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
        const existingTooltip = window.bootstrap.Tooltip.getInstance(el);
        if (existingTooltip) existingTooltip.dispose();
        new window.bootstrap.Tooltip(el, { html: true });
        });
    }, 100);

    return () => clearTimeout(timeout);
    }, [store.hoverCountryInfo]);



    const handleCountryClick = (geo) => {
		const name = geo.properties.name;
        fetchMapData(geo.properties.ISO_A3, dispatch);
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
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-html="true"
                    title={
                        (() => {
                        const info = store.hoverCountryInfo;
                        if (!info || geo.properties.name !== info.name) {
                            return geo.properties.name;
                        }

                        const flag = info.flag || '';
                        const currency = info.currency || 'N/A';
                        const languages = Array.isArray(info.languages) ? info.languages : [];

                        return `
                            <strong>${geo.properties.name}</strong><br/>
                            ${flag ? `<img src="${flag}" width="20" /><br/>` : ''}
                            Currency: ${currency}<br/>
                            Language: ${languages.join(', ')}
                        `;
                        })()
                    }
                    />
                    ))
                }
            </Geographies>
        </ComposableMap>
    </>
    )
};