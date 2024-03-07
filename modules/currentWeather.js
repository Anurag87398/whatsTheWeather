// module to return the weather of a particular location
// returns a function which takes in (lat,long) and returns weather/error
// fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&timezone=auto&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset`)

// console.log("in currentWeather.js");
const getWeather= async function(latitude, longitude){

    // API #1 (10k/day)
    const resp= await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_mean,weather_code,sunrise,sunset&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,relative_humidity_2m`);
    const data= await resp.json();
    // console.log(data);
    return data;
}

export {getWeather};



// i need data of 7 days
// for each day(daily), i need: 
    // hourly=> temp, precipitation, wind   **********
    // curr temp (for other days, curr temp == max temp of that day) ********
    // max, min temp *******
    // humidity: for curr day we have humidity, for other days=> do mean of hourly ones *********
    // avg wind, ******
    // avg precipitation *******
    // conversion for C/F ********
// for current day, display hourly data from the next hour, till how mnay hours left of what i show
// for other days, 1am to 10pm