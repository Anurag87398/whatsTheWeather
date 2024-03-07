// module that returns a function to reverse geocode from coordinates to address

// console.log(process.env);

const reverseGeocode= async function(latitude, longitude){
    try{
        // const latitude= 22.5726;
        // const longitude= 88.3639;
        const resp= await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=en&limit=1&format=json&apiKey=3927144e7e704bf5b6b0c34bf514c8a5`);
        
        const data= await resp.json();
        // console.log(data);

        if(data==undefined || !data.results)
            throw new Error("Location not found by Reverse Geocoding API :/");

        const {results: [rawDetails]}= data;
        // console.log(rawDetails);
        
        const extractedDetails={
            // placeName: rawDetails.name,
            // county: rawDetails.county,
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