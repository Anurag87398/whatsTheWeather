// efbfd936aaad164a74e6e78129f9fa6e
// https://openweathermap.org/api/geocoding-api#direct
// place,country,...=> http://api.openweathermap.org/geo/1.0/direct?q=${place}&appid=efbfd936aaad164a74e6e78129f9fa6e


// https://myprojects.geoapify.com/api/wVzFQYlMpXB2D1XyiUaI/keys
// https://apidocs.geoapify.com/playground/geocoding/?params=%7B%22query%22:%2252.3877211,%209.7333688%22,%22numberOfResults%22:1,%22lang%22:%22en%22,%22filterValue%22:%7B%22radiusMeters%22:1000%7D,%22biasValue%22:%7B%22radiusMeters%22:1000%7D%7D&geocodingSearchType=full
// replace ' '=> %20, ','=> %2C
// https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=3927144e7e704bf5b6b0c34bf514c8a5

// console.log("inside geocoding.js");

const geocode= async function(address){
    try{
        const query1= address.replace(" ", "%20").replace(",", "%2C");
        const resp= await fetch(`https://api.geoapify.com/v1/geocode/search?text=${query1}&lang=en&limit=1&format=json&apiKey=3927144e7e704bf5b6b0c34bf514c8a5`);
        // console.log(resp);
        const {results: [data]}= await resp.json();
        console.log(data);

        if(data==undefined)
            throw new Error("Location not found by Geocoding API :/");
        
        return data;
    }
    catch(error){
        console.log(error);
        return -1;
    }
}


export {geocode};




// API #1 (3K/day)  ********** USE THIS **********
    // gives state, city, country (if present), but gives wrong loactions sometimes
    // but, if precise location given then this performs better than API #3
    // if name present => match with city and state, if same then don't display that attr
    // if name absent => display city and state as is


// const query2= addr.replace(",", "").replace(" ", "+");
// API #2
    // const temp2= await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${addr}&limit=1&appid=efbfd936aaad164a74e6e78129f9fa6e`);
    // const temp2Parsed= await temp2.json();
    // console.log(temp2Parsed);
    // console.log(temp2Parsed[0]);
    
    // API #3 (1M/day) 
    // site: https://geocode.maps.co/
    // API: https://geocode.maps.co/search?q=&api_key=
    // doesnt give (state, city, country), but does give undefined when location not found
    // for reverse geocoding, it doesn't give city all the times
    // const temp= await fetch(`https://geocode.maps.co/search?q=${query2}&api_key=65e2ee3bf029d966947675ehy5e9f45`);
    // const tempParsed= await temp.json();
    // // console.log(tempParsed);
    // console.log(tempParsed[0]);

    // return data;
    
    // if(data.result_type=="country" || "state") => will have to handle the display accordingly
    // in case the place provided is same as the state, 
    // we will display weather of the capital