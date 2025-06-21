export const fetchMapData = async (name, dispatch) => {
    try{
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
        const data = await res.json();
        const country = data[0];

        const timezone = country.timezone[0];
        const timeRes = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
        const timeData = await timeRes.json();
    

    dispatch({
        type: "set_country_info",
        payload: {
            name: country.name.common, // <--- for tooltip match
            flag: country.flags.svg,
            currency: Object.values(country.currencies)[0].name,
            time: timeData.datetime,
        },
    });

    } catch(err) {
        console.error("Error fetching country infor:", err);
    }
    


}