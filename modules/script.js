'use strict';

// efbfd936aaad164a74e6e78129f9fa6e
// https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=efbfd936aaad164a74e6e78129f9fa6e
// https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&hourly=temperature_2m

import { getCurrentLocation } from "./currentLocation.js";
import { getWeather } from "./currentWeather.js";
import { geocode } from "./geocoding.js";
import { organize } from "./organizeData.js";
import { reverseGeocode } from "./reverseGeocoding.js";
import { renderWeather } from "./renderWeather.js";

// SELECTING COMPONENTS
const mainOuterContainer= document.querySelector('.main-outer-container');
const formInnerContainer= document.querySelector('.form-inner-container');
const weatherReportContainer= document.querySelector('.report-container');
const loader= document.querySelector('.loading-container');
const bgImage= document.querySelector('.body-bg');
const btnCustomPlace= document.querySelector('.place-btn');
const btncurrLocation= document.querySelector('.current-loc-btn');
const inputElement= document.querySelector('.place-input');


const loadImage= function(imageElement){
    // function which returns a promise when the bg img is loaded in current session
    return new Promise((resolve, reject)=>{
        imageElement.onload= resolve;
        imageElement.onerror= reject;
    });
};

const wait= async function(sec){
    // function which returns a promise when timer runs out
    return new Promise(resolve=>{
        // console.log("watiintg for : " + sec);
        setTimeout(resolve,sec*1000);
    });
};


// helper functions to display error messages
const displayCustomLocationError= function(errorMessage){
    const errorElement= document.getElementById('em-custom-place');
    errorElement.textContent= errorMessage;
    errorElement.classList.remove('hide');
    unloading(btnCustomPlace);
};
const displayCurrLocationError= function(errorMessage){
    const errorElement= document.getElementById('em-current-loc');
    errorElement.textContent= errorMessage;
    errorElement.classList.remove('hide');
    unloading(btncurrLocation);
};
const loading= function(buttonElement){
    // function to disable a button and show loading symbol
    buttonElement.disabled= true;

    // diable both buttons
    btnCustomPlace.classList.add('disabled');
    btncurrLocation.classList.add('disabled');

    // height of the spinner added must be height of the content in current button
    const height= +getComputedStyle(buttonElement).height.slice(0,-2);
    const padding= +getComputedStyle(buttonElement).paddingTop.slice(0,-2) + +getComputedStyle(buttonElement).paddingBottom.slice(0,-2);
    const border= +getComputedStyle(buttonElement).borderTopWidth.slice(0,-2) + +getComputedStyle(buttonElement).borderBottomWidth.slice(0,-2);
    const contentHeight= height-padding-border;
   
    // updating the HTML text inside the button
    buttonElement.innerHTML= `<div class="loading-spinner btn-loading-spinner" style="height: ${contentHeight}px; width: ${contentHeight}px; margin: 0 auto;"></div>`;
};
const unloading= function(buttonElement, ogHTML){
    // function to enable a button and reset its status
    buttonElement.innerHTML= ogHTML;
    btnCustomPlace.classList.remove('disabled');
    btncurrLocation.classList.remove('disabled');
    buttonElement.disabled= false;
    inputElement.value= "";
}


// event handlers
const customLocationHandler= async function(event){
    const input= inputElement.value;
    if(!input){
        alert("Please enter a location!");
        return;
    }

    // if a potentially valid input
    const ogBtnText= btnCustomPlace.innerHTML;
    try{
        // update status of button as loading to prevent spamming API calls
        loading(btnCustomPlace);
        const geocodeResult= await geocode(input);
        if(geocodeResult==-1){
            // display an error msg and return
            displayCustomLocationError("Couldn't find this location :')");
            return;
        }

        // console.log(geocodeResult);
        
        // From the geocodeResult, we will use: addr_line1, city, state, country
        const placeDetails={
            placeName: geocodeResult.address_line1,
            city: geocodeResult.city,
            state: geocodeResult.state,
            country: geocodeResult.country,
            latitude: geocodeResult.lat,
            longitude: geocodeResult.lon,
        };
        console.log(placeDetails);



        // now use the weather API
        const weatherDetails= await getWeather(placeDetails.latitude, placeDetails.longitude);
        console.log(weatherDetails);

        // reformatting raw weather data
        const {current, daily, hourly}= organize(weatherDetails);
        console.log(current);
        console.log(daily);
        console.log(hourly);

        // now need display weather report
        // console.log(weatherReportContainer);
        renderWeather(current,hourly,daily, placeDetails);
        formInnerContainer.classList.toggle('hide');
        weatherReportContainer.classList.toggle('hide');

    }
    catch(error){
        console.log(error);
    }
    finally{
        // restore button status to allow future requests
        unloading(btnCustomPlace, ogBtnText);
    }
};
const currentLocationHandler= async function(event){
    // this func won't receive a error, as helper function handles it
    // but still for the sake of it

    const ogBtnText= btncurrLocation.innerHTML;
    try{
        // update status of button as loading to prevent spamming API calls
        loading(btncurrLocation);

        
        // using geolocation API
        const result= await getCurrentLocation();
        if(result==-1){
            // display an error msg and return
            displayCurrLocationError("Error getting your location :/");
            return;
        }
        const coords= result.coords;
        console.log(coords);

        // NOTE: I won't be calling the weather API, unless I can determine 
        // the address of the user, since I need that while displaying the weather
        // Hence, I'm not calling the weather API in parallel, as it could be wasted

        // getting address of current location using geocoding API
        const reverseGeocodeResult= await reverseGeocode(coords.latitude, coords.longitude);
        console.log(reverseGeocodeResult);

        if(reverseGeocodeResult==-1){
            // display an error msg and return
            displayCurrLocationError("Error getting info for your location :/");
            return;
        }
        // NOTE: no need to refine reverseGeocodeResult as it is already done

        
        // getting the weather details using weather API
        const weatherDetails= await getWeather(coords.latitude, coords.longitude);
        console.log(weatherDetails);

        // reformatting the raw data
        const {current, daily, hourly}= organize(weatherDetails);
        console.log(current);
        console.log(daily);
        console.log(hourly);


        // now need display weather report 
        // console.log(weatherReportContainer);
        renderWeather(current,hourly,daily, reverseGeocodeResult);
        formInnerContainer.classList.toggle('hide');
        weatherReportContainer.classList.toggle('hide');


    }
    catch(error){
        console.log(error);
    }
    finally{
        // restore button status to allow future requests
        unloading(btncurrLocation, ogBtnText);
    }
};
const inputEnterHandler= function(event){
    if(event.key==="Enter")
        customLocationHandler(event);
}

// event listeners for location input form
btnCustomPlace.addEventListener('click', customLocationHandler);
btncurrLocation.addEventListener('click', currentLocationHandler);
inputElement.addEventListener('keyup', inputEnterHandler);


// waiting till the bg image of main page gets loaded (for slow connections)
try{
    const bgImageURL= "./media/backgrounds/earth.jpg";
    const image= new Image();
    image.src= bgImageURL;
    await loadImage(image);
    console.log("image loaded. Assigning image src as bg img");
    
    mainOuterContainer.style.backgroundImage= `url(${bgImageURL})`;             // adding img as bg
    mainOuterContainer.classList.remove('hide');                                // showing main screen
    loader.style.opacity= '0';                                                  // making opacity 0 for smooth transition
    
    await wait(+getComputedStyle(loader).transitionDuration.replace("s", ""));  // waiting for opacity to become 0
    loader.classList.add('hide');                                               // removing loading screen only after opacity has become 0

    // adding focus to the custom location input
    inputElement.focus();
}
catch(error){
    console.log(error);
    console.log("Intenet very slow :/");
}
