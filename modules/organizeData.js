// module to organize the data into the necessary format 
// returns the function for organizing the data which takes in the raw weather report and returns a nicely formatted one


import {WMO} from "./weatherCodes.js";

const getDailyData= function(dailyObject, timeOfDay, daysCount){
    // this function returns daily weather forecast for 'daysCount' days

    const dailyData= [];
    
    for(let i=0; i<daysCount; i++){
        const currDayData= {}; // object containing daily data of curr day

        currDayData.date= new Date(dailyObject.time[i]);
        currDayData.tempMaxC= Math.round(dailyObject.temperature_2m_max[i]);
        currDayData.tempMinC= Math.round(dailyObject.temperature_2m_min[i]);
        currDayData.tempMaxF= Math.round(currDayData.tempMaxC * 9/5) + 32;
        currDayData.tempMinF= Math.round(currDayData.tempMinC * 9/5) + 32;
        currDayData.windSpeedMax= Math.round(dailyObject.wind_speed_10m_max[i]);
        currDayData.precipitation= dailyObject.precipitation_probability_mean[i];
        currDayData.sunrise= new Date(dailyObject.sunrise[i]);
        currDayData.sunset= new Date(dailyObject.sunset[i]);
        currDayData.weather_code= dailyObject.weather_code[i];
        
        currDayData.weather_description= WMO[currDayData.weather_code][timeOfDay]["description"];
        currDayData.weather_image= WMO[currDayData.weather_code][timeOfDay]["image"];

        dailyData.push(currDayData);
    }
    return dailyData;
};

const getCurrentData= function(currentObject, timeOfDay, currTime){
    // this function returns the weather info of the current day at the time of the request

    const currentData= {
        time: currTime,
        temperatureC: Math.round(currentObject.temperature_2m),
        feelsLikeC: Math.round(currentObject.apparent_temperature),
        humidity: currentObject.relative_humidity_2m,
        windSpeed: Math.round(currentObject.wind_speed_10m),
        windDirection: currentObject.wind_direction_10m,
        precipitation: currentObject.precipitation_probability,
        weather_code: currentObject.weather_code,
    };
    currentData.temperatureF= Math.round(currentData.temperatureC * 9/5) + 32;
    currentData.feelsLikeF= Math.round(currentData.feelsLikeC * 9/5) + 32;
    currentData.weather_description= WMO[currentData.weather_code][timeOfDay]["description"];
    currentData.weather_image= WMO[currentData.weather_code][timeOfDay]["image"];

    return currentData;
};

const getHourlyData= function(hourlyObject, daysCount, currTime){
    // this function returns hourly weather forecast for 'daysCount' days
    
    // i have n days, each day has 24hrs => i have (n*24) time values
    // from (n*24), 
    // for future days: 1am to 12am => 24hrs
    // for current day: curr time hour to next 24hrs

    // since time is stored as a string, there is no other way than to convert each of them into a date obj for comparison
    const hourlyData= [];
    const noOfHours= hourlyObject.time.length/daysCount;

    for(let i=0; i<daysCount; i++){
        const eachDay={
            time: [],
            temperatureC: [],
            temperatureF: [],
            humidity: [],
            precipitation: [],
            windSpeed: [],
            windDirection: [],
        };

        // for each day suppose I'll have 24 hourly data available
        for(let j=0; j<noOfHours; j++){
            // for current day, time starts from (i*24+j)th idx
            const dayIdx= i*noOfHours;
            // console.log(`Current day starts at ${dayIdx}idx`);
            eachDay.time.push(new Date(hourlyObject.time[dayIdx+j]));
            eachDay.temperatureC.push(Math.round(hourlyObject.temperature_2m[dayIdx+j]));
            eachDay.temperatureF.push(Math.round(eachDay.temperatureC[j] * 9/5) + 32);
            eachDay.humidity.push(hourlyObject.relative_humidity_2m[dayIdx+j]);
            eachDay.precipitation.push(hourlyObject.precipitation_probability[dayIdx+j]);
            eachDay.windSpeed.push(Math.round(hourlyObject.wind_speed_10m[dayIdx+j]));
            eachDay.windDirection.push(hourlyObject.wind_direction_10m[dayIdx+j]);
        }
        hourlyData.push(eachDay);
    }

    // now for current day, ie, idx 0 => need to filter all hours which are < current time's hour
    // followed by that need to add remaining hourly data from the next day to make it complete 24hrs of data
    const currDay= hourlyData[0];
    const idx= currTime.getHours();     // if my curr time is 1am => 01 hours => 1st idx
    
    // need to slice the og array
    hourlyData[0].time= hourlyData[0].time.slice(idx);
    hourlyData[0].temperatureC= hourlyData[0].temperatureC.slice(idx);
    hourlyData[0].temperatureF= hourlyData[0].temperatureF.slice(idx);
    hourlyData[0].humidity= hourlyData[0].humidity.slice(idx);
    hourlyData[0].precipitation= hourlyData[0].precipitation.slice(idx);
    hourlyData[0].windSpeed= hourlyData[0].windSpeed.slice(idx);
    hourlyData[0].windDirection= hourlyData[0].windDirection.slice(idx);
    
    // take up remanining hourly data from next day
    hourlyData[0].time= hourlyData[0].time.concat(hourlyData[1].time.slice(0,idx));
    hourlyData[0].temperatureC= hourlyData[0].temperatureC.concat(hourlyData[1].temperatureC.slice(0,idx));
    hourlyData[0].temperatureF= hourlyData[0].temperatureF.concat(hourlyData[1].temperatureF.slice(0,idx));
    hourlyData[0].humidity= hourlyData[0].humidity.concat(hourlyData[1].humidity.slice(0,idx));
    hourlyData[0].precipitation =hourlyData[0].precipitation.concat( hourlyData[1].precipitation.slice(0,idx));
    hourlyData[0].windSpeed= hourlyData[0].windSpeed.concat(hourlyData[1].windSpeed.slice(0,idx));
    hourlyData[0].windDirection= hourlyData[0].windDirection.concat(hourlyData[1].windDirection.slice(0,idx));

    return hourlyData;
};

const organize= function(weatherRawObject){
    // this func organizes the raw weather obectj into current, daily & hourly data objects
    // it returns an object containing the three

    // general info about current req
    // const timeOfDay= (weatherRawObject.current.is_day===1)? "day" : "night";
    const timeOfDay= "day";     // fixing time as day, since WMO images for night are  just for dark theme and not for night time :')
    const daysCount= weatherRawObject.daily.time.length;
    const currTime= new Date(weatherRawObject.current.time);

    // organizing current info
    const currData= getCurrentData(weatherRawObject.current, timeOfDay, currTime);
    
    // organizing daily info
    const dailyData= getDailyData(weatherRawObject.daily, timeOfDay, daysCount);
    
    // organizing hourly info
    const hourlyData= getHourlyData(weatherRawObject.hourly, daysCount, currTime);

    return {
        current: currData,
        daily: dailyData,
        hourly: hourlyData,
    };
};

export {organize};