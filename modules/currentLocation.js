// a module to get the current location (if available)
// returns: function to get the current location

// navigator.geolocation.getCurrentPosition() is an async func
// meaning, it will run in the bg, and execution of main script will continue as is
// but we need to wait till we get the current location
// so use promise to store the future val of current location/ promisify it

// console.log("in currentLocation.js");
const promisifyLocation= () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true, timeout : 5000}));

const getCurrentLocation= async function(){
    try{
        const position= await promisifyLocation();
        return position;
    }
    catch(error){
        console.log("Error in getCurrentLocation(): " + error);
        return -1;
    }
}

export {getCurrentLocation};