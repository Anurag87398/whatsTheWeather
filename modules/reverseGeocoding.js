// module to reverse geocode the address from coordinates
// returns the function which takes in the coordinates(latitude,longitude) and returns the address

const reverseGeocode= async function(latitude, longitude){
    try{
        const resp= await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=en&limit=1&format=json&apiKey=3927144e7e704bf5b6b0c34bf514c8a5`);
        const data= await resp.json();

        if(!data || !data.results)
            throw new Error("Location not found by Reverse Geocoding API :/");
        const {results: [rawDetails]}= data;

        const extractedDetails={
            city: rawDetails.city,
            state: rawDetails.state,
            country: rawDetails.country,
        };
        return extractedDetails;
    }
    catch(error){
        console.log(error);
        return -1;
    }
}


export {reverseGeocode};