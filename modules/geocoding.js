// module to return the coordinates of a particular location
// returns the function which takes in the address and returns coordinates(latitude,longitude)

const geocode= async function(address){
    try{
        const query1= address.replace(" ", "%20").replace(",", "%2C");
        const resp= await fetch(`https://api.geoapify.com/v1/geocode/search?text=${query1}&lang=en&limit=1&format=json&apiKey=3927144e7e704bf5b6b0c34bf514c8a5`);
        // console.log(resp);
        const {results: [data]}= await resp.json();

        if(!data)
            throw new Error("Location not found by Geocoding API :/");
        
        return data;
    }
    catch(error){
        console.log(error);
        return -1;
    }
}

export {geocode};