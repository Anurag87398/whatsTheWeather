// module that renders the weather report
// returns a function which takes in the current, hourly & daily weather data along with the address and renders the weather report

// SELECTING COMPONENTS
// for current report section
const reportContainer= document.querySelector('.report-container');
const currentWeatherImageELement= document.querySelector('.current-weather-logo');
const currentTemperatureElement= document.querySelector('.current-temp');
const cSelector= document.querySelector('.C-selector');
const fSelector= document.querySelector('.F-selector');
const currentPlace= document.querySelector('.place');
const currentTime= document.querySelector('.time');
const currentWeatherDesc= document.querySelector('.weather-description');
const currentFeels= document.getElementById('current-feels-text');
const currentFeelsElement= document.querySelector('.current-feels');
const currentPrecipitation= document.getElementById('current-precipitation-text');
const currentHumidity= document.getElementById('current-humidity-text');
const currentHumidityElement= document.querySelector('.current-humidity');
const currentWind= document.getElementById('current-wind-text');
const resetElement= document.getElementById('reset-para');
const weekDays= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekDaysShort= ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// for daily reports section
const dailyInfoContainer= document.querySelector('.daily-info-container');

// GLOBAL VARIABLES
let currActiveDay= 0;           // initally 1st day will be active one
let currTemperatureUnit= 'C';   // intially choosing Celsius as the temperature unit
let myChart;                    // variable to store the chart object created

const setCurrentReport= function(currentData, initial= false, addressData){
    // function to render current weather report section 

    if(initial){
        // will display some additional features (feels like temperature, humidity) => since we have different objects for current and daily data
        currentWeatherImageELement.src= currentData.weather_image;
        currentTemperatureElement.textContent= currentData[`temperature${currTemperatureUnit}`];
        cSelector.classList.add('temperature-selected');
        currentPlace.textContent= `${addressData.city || addressData.state || addressData.country}`;
        const date= currentData.time;

        // converting the time of request as: 2:47 pm => 2:00 pm
        currentTime.textContent= `${weekDays[date.getDay()]}, ${(date.getHours()>=12)? `${(date.getHours()==12)? "12": date.getHours()-12}:00 pm` : `${(date.getHours()==0)? "12": date.getHours()}:00 am`}`;
        currentWeatherDesc.textContent= currentData.weather_description;
        currentFeels.textContent= currentData[`feelsLike${currTemperatureUnit}`];
        currentPrecipitation.textContent= currentData.precipitation;
        currentHumidity.textContent= currentData.humidity;
        currentWind.textContent= currentData.windSpeed;
        return;
    }

    // need to set data as per the daily weather report data
    currentWeatherImageELement.src= currentData.weather_image;
    currentTemperatureElement.textContent= currentData[`tempMax${currTemperatureUnit}`];
    currentTime.textContent= weekDays[currentData.date.getDay()];
    currentWeatherDesc.textContent= currentData.weather_description;
    currentPrecipitation.textContent= currentData.precipitation;
    currentWind.textContent= currentData.windSpeedMax;

    // hide additional weather info
    currentHumidityElement.classList.add('hide');
    currentFeelsElement.classList.add('hide');
};

const createChart= function(hourlyData){
    // function to create the hourly temperature chart (using Chart.js) for the currently active day

    // selecting the canvas on which the chart will be drawn
	const canvasElement= document.getElementById('myChart');

	// changing default styling
	Chart.defaults.color= "white";
	Chart.defaults.borderColor= "transparent";
	Chart.defaults.font.family= "Roboto";
	// Chart.defaults.font.size= 16;	// 12 default

	// getting the formatted time labels (x-axis) => (12am, 1am, ...)
	const timeLabels= hourlyData[0].time.map(date => (date.getHours()>=12)? `${(date.getHours()==12)? "12": date.getHours()-12} pm` : `${(date.getHours()==0)? "12": date.getHours()} am`);
	// console.log(timeLabels);
	
    // returning the created chart object
	return new Chart(canvasElement, {
		type: 'line',
		data: {
			  labels: timeLabels,
			  datasets: [{
				label: 'Temperature (°C)',
				data: hourlyData[0].temperatureC,
				borderWidth: 3,
				borderColor: "rgb(255, 111, 0)",
				tension: 0.2,
				fill: {
					target: 'origin',
					above: 'rgba(255, 111, 0, 0.300)',
				},
				pointBorderColor: "transparent",
			}],
		},
		options: {
            responsive: true,
            maintainAspectRatio: false,
			layout: {
				padding: {
					// left: 50,
				}
			},
			  scales: {
			y: {
                ticks:{
                    maxTicksLimit: 4,
                },
				display: false,
			},
			x:{
				ticks: {
					maxRotation: 0,
					// autoSkipPadding: 40,
					align: 'start'
				},
			}
		  },
		  plugins:{
			legend: {
				display: false,
			},
		  },
		},
	});
};

const updateChart= function(chart, newDayData){
    // function to update the chart with new data values

	const newLabels= newDayData.time.map(date => (date.getHours()>=12)? `${(date.getHours()==12)? "12": date.getHours()-12} pm` : `${(date.getHours()==0)? "12": date.getHours()} am`);
	chart.data.labels= newLabels;
	chart.data.datasets.forEach((dataset) => {
		dataset.label= `Temperature (°${currTemperatureUnit})`;			// choose labels according to current temperature unit
		dataset.data= newDayData[`temperature${currTemperatureUnit}`];	// choose Celsius/Fahrenheit
    });
	chart.update();
};

const setDailyReport= function(dailyData){
    // function to render the daily weather summary for each day

    // map over the dailyData and render a 'day-card' for each day
    // we can give them IDs as the idx value ;)
    dailyData.map((dayCard, idx)=>{
        dailyInfoContainer.insertAdjacentHTML('beforeend', 
        `<div id="${idx}" class="day-card ${(idx==0)? "day-card-selected": ""}">
        <p class="day">${weekDaysShort[dayCard.date.getDay()]}</p>
        <div class="weather-logo-container">
            <img class="weather-logo" src=${dayCard.weather_image} alt="weather-logo">
        </div>
        <p class="max-min"><span class="max-daily">${dayCard.tempMaxC}</span>° <span class="min-daily">${dayCard.tempMinC}</span>°</p>
    </div>`);
    });
};

const changeTemperatureUnit= function(hourlyData, dailyData, addressData){
    // function to change the current temp units (C/F)
    
    const convertor= function(unit){
        // a function which will return a convertor func to convert to our desired temp unit
        if(unit==='F')
            return (val) =>  Math.round(val * 9/5) + 32;    // C -> F
        return (val) => Math.round((val-32)*5/9)            // F -> C
    };
    const myConvertor= convertor((currTemperatureUnit==='C')? 'F' : 'C');

    // when user wants to switch units :
    // => I'll loop over daily reports => make change there
    // => just change the current displaying temperature, by calling setCurrentReport, with inital false

    // looping over daily reports (will also store which day is currently being displayed)
    let currentDayObject;
    let currDayHourlyObject;
    for(let i=0; i<dailyInfoContainer.children.length; i++){
        const day= dailyInfoContainer.children[i];
        if(day.classList.contains('day-card-selected')){
            currentDayObject= dailyData[day.id];
            currDayHourlyObject= hourlyData[day.id];
        }
        const maxTempElement=  day.querySelector('.max-daily');
        const minTempElement=  day.querySelector('.min-daily');
        maxTempElement.textContent= myConvertor(+maxTempElement.textContent);
        minTempElement.textContent= myConvertor(+minTempElement.textContent);
    }

    // changing the current temperature unit
    currTemperatureUnit= (currTemperatureUnit==='C')? 'F': 'C';
    
    // update current temperature section
    setCurrentReport(currentDayObject, false, addressData);

    // update the chart
    updateChart(myChart, currDayHourlyObject);
}

const renderWeather= function(currentData, hourlyData, dailyData, addressData){
    // function to render the weather report consisting of current, hourly and daily data

    setCurrentReport(currentData, true, addressData);   // initially rendering current weather data
    myChart= createChart(hourlyData);                   // creating the hourly weather data chart
    setDailyReport(dailyData);                          // rendering daily weather data

    // now making the eventlistner for dailyReportContainer
    dailyInfoContainer.addEventListener('click', function(event){
        // detect which 'day-card' has been clicked
        // it will then update the current report to that day's report
        // and change the 'current active day'

        // we need to find the closest 'day-card' element of the event.target element
        const cardClicked= event.target.closest('.day-card');
        
        if(!cardClicked) // if the gap between the cards are clicked
            return;

        // now have to remove active card status from currently active 'day-card'
        const currActiveCard= dailyInfoContainer.children[currActiveDay];
        currActiveDay= cardClicked.id;
        currActiveCard.classList.remove('day-card-selected');
        cardClicked.classList.add('day-card-selected');

        // need to update current report section with newly active day's data
        setCurrentReport(dailyData[currActiveDay], false, addressData);

        // need to update chart
        updateChart(myChart, hourlyData[currActiveDay]);
    });


    // event listners for temperature units
    cSelector.addEventListener('click', function(event){
        if(currTemperatureUnit==='C')
            return;
        changeTemperatureUnit(hourlyData, dailyData, addressData);
        // making changes in active temperature unit style
        fSelector.classList.remove('temperature-selected');
        this.classList.add('temperature-selected');
    });
    fSelector.addEventListener('click', function(event){
        if(currTemperatureUnit==='F')
            return;
        changeTemperatureUnit(hourlyData, dailyData, addressData);
        // making changes in active temperature unit style
        cSelector.classList.remove('temperature-selected');
        this.classList.add('temperature-selected');
    });

    // event listner for reset state
    resetElement.addEventListener('click', ()=>location.reload());
};

export {renderWeather};