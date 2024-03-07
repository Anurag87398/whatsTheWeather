# DEVLOG
Hello there! 👋🏻

If you're interested in knowing how I thought about and went through with the development of my project "What's the Weather?", then this log is for you.

Here, I've documented what I did, what challenges I faced and how I tackled them each day. I'm still just a beginner trying to figure out my way into the development world 😉<br>
So, feel free to give me any suggestions on how to improve my overall process. 

Well, let's get started!

## DAY 1 (02/03/24)
### Figuring out APIs + Starting with HTML/CSS 
<br>

**Which type of locations to serve?**
- Firstly, I wanted to make a weather App which could deal with both- user's current location as well as any desired place on the planet.
- For the current location, I used the navigator.geolocation API provided by the browser itself.
- For getting any other location, I can just take an input from the user.
- Thus, the landing page of my project should have two choices for the user.

<br>

**How to get the weather info?**
- I looked on the internet to find free weather APIs which had a descent limit on their free access.
- I found that to provide the most accurate location to these APIs, (latitude,longitude) would be the way.
- Hence I'll now have to geocode the custom location entered by the user, but more on that later. 
- I found a few descent free weather APIs:
    - [Open-Meteo](https://open-meteo.com/)<br>
        - This API had 10k/day free access limit (pretty good!)
        - It provided current weather info, daily weather info for upto 16 days as well as hourly info for all these days (perfect!) 🔥
    - [Open Weather](https://openweathermap.org/api)<br>
        - This API had 1M/month free access limit (Still good!)
        - However, it only provided 3 hour forecasts for upto 5 days
- Thus, I decided to go with **Open-Meteo** as it provided data in more detail for each hour and for more days.

<br>

**Geocoding/Reverse Geocoding**
- As mentioned in the previous section, I'll have to convert the address provided by the user into a (latitude,longitude) pair. For that we use any Geocoding API. I went through a couple of them:
    - [Geoapify](https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#about)<br>
        - This has a request limit of 3K/day.
        - The unique part is it can work with a string of address like "Camp Nou, Barcelona,..." rather than just specifying a single word of the place like "Mumbai".
        - The results provided by this API was also very close to accurate.
    - [Open Weather](https://openweathermap.org/api/geocoding-api)<br>
        - The issue with this API was that it wanted the search query in a specific format as "city, state". But, in real life hardly any user would put in so much effort.
        - However if provided the address in correct format, it gives accurate results.
    - [Geocoding](https://geocode.maps.co/)<br>
        - This is by far the most simplest and easy to use API amongst all mentioned here.
        - It also allows 1M/month requests.
        - But, if the address provided is too long or not so accurate, it gives an error.
- Keeping all of the limitations and benefits in mind, I decided to go with **Geoapify**
- Now imagine the user want's to know the weather of their current location, which I'll be getting as a (latitude,longitude) pair as is.
- But, to display the info in my app, I needed the name of the place as well:<br>
for which **Geoapify** also had a Reverse Geocoding API (just like the others) but it also provided all the properties that I was looking for 🙇🏻‍♂️


<br>

**HTML & CSS**
- I decided to go with a high resoultion background image, which could take some time to load on slower networks. Thus, I'll be adding a sort of loading page, till the image is loaded and then the user will get to have a more beautiful frontend experience.
- Once everything is loaded, I need to ask the user the type of input they want to go with: *current location* (or) *A place that they have in mind*.
- Finished today's session with the loading screen working with the bg image being loaded and added a simple navbar.
- Face a lot of difficulties as I had applied a filter on the image, but turns out it can't be overridden, so just edited the image and used it :')

<br>

## DAY 2 (03/03/24)
### Location Retrieving Form(CSS) + Organizing API responses(JS)
<br>

**A form to ask the user's input choice**
- A simple initial form to be built. Thinking of using glass morphism for a more sleek look 😗
- If all goes well, then will work on organizing the API responses in proper variables so that I'll just have to add the CSS and connect it (:
- Finished the 1st part (: => having issues to access current location from mobile devices, but everyone's saying it's due to http instead of https. So, will try to upload the code on github and check, but for that need to hide the API keys in .env, so will do that when I complete the 2nd part 😪

<br>

## DAY 3 (04/03/24)
### Organizing API responses(JS) + Improving 1st part's script
<br>

**Organized the raw weather reports**
- Couldn't start with this work yesterday :')
- Wrote a module to organize and destructure the raw data into the format that I need for my frontend
- majority of the time went in this

<br>

**Improved handling multiple requests**
- Added loading states to the buttons while taking and fetching the user's location and weather details so users cannot spam the API.
- Moreover, thinking of replacing the entire API url in the .env file so no chance of spamming even if the user wants (but hiding the API key itself would do the trick it seems 🤔)

Planning on starting off the frontend for displaying the weather results from tomorrow (:


<br>

## DAY 4 (05/03/24)
### Frontend for weather report(HTML/CSS)
<br>

**Rendered the weather report**
- Finished the HTML/CSS part for displaying the weather report
- Wrote a module to render the organized weather report
- Need to fix: 
    - report container shrinking when less data displayed
    - handling undefined properties in address object
    - adding 'enter' support while taking location
    - Celsius to Fareheit and vice-versa convertor
    
    ( *cries in pain* 😭 )

Planning on fixing the above issues tomorrow, along with figuring out how to work with charts in js. If I'm able to grasp it, will include it day after, else will think about some alternative (maybe).


<br>

## DAY 5 (06/03/24)
### Bug fixes + Creating hourly data chart(Chart.js) + Research
<br>

**Fixed previously detected bugs + Added features**
- CSS responsiveness
- handling undefined properties from API results
- 'enter' support for input
- temperature convertor 

<br>

**Rendered the hourly data chart**
- Used Chart.js to reneder the responsive and sleek looking graph for how temperatures fluctuate hourly for a particular day 😉
- Fixed reponsiveness as well

<br>

**Researching for hiding API keys**
- Since I have used API keys in this project (although free), they must be kept private.
- However after a bit of resarch I came to know that we cannot really hide any sensitive information if we are just building a frontend project without any frameworks (like mine is 😞).
- Think about it, no matter what we do, the browser will send a request to the URL present in our code, it will need to replace the varibale in place of our API_KEY, and we can easily view it by inspeting the source code.
- Unfortunately I had to upload the codes as is, but if we were using a backend part as well (which I will in my future projects), we can use bundlers or .env files to hide access to our sensitive information.

<br>

## DAY 6 (07/03/24)
### Finishing up
<br>

**Cleaning up the Source Code**
- removing unnecessary console.logs
- organizing everything in place (which was mostly done during development itself 😊)

<br>

**Documentation**
- Writing up the README.md for the project and uploading


<br>
Overall it was a very fun week I got to experience while working on this project. I learned so many new things, handled new errors, improved my skills in reading documentations and improved my code writing and understanrding as well. 

<br>
Until next time!! 🙋🏻‍♂️