export const fetchMapData = async (alpha3Code, dispatch) => {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${alpha3Code}`);
        if (!res.ok) throw new Error(`Country fetch failed: ${res.status}`);
        const [country] = await res.json();

        dispatch({
            type: "set_country_info",
            payload: {
                name: country.name.common,
                flag: country.flags.svg,
                currency: Object.values(country.currencies)[0].name,
                language: Object.values(country.languages)[0],
            },
        });

    } catch (err) {
        console.error("Error fetching country info:", err);
    }
};
