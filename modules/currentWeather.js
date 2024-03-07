// module to return the weather data of a particular location
// returns the function which takes in (latitude,longitude) and returns weather report/error


const getWeather= async function(latitude, longitude){
    const resp= await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_mean,weather_code,sunrise,sunset&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,relative_humidity_2m`);
    const data= await resp.json();
    return data;
}

export {getWeather};
