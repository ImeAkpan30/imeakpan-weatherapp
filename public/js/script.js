if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../sw.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

let appId = 'c33b790025d0c35ad2f2954e89937550';
let units = 'metric';
let searchMethod;

function getSearchmethod(searchTerm) {
    if(searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    else
        searchMethod = 'q';
}

function searchWeather(searchTerm) {
    getSearchmethod(searchTerm);
    fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`).then(result => {
        return result.json();
    }).then(result => {
        init(result);
    })
}

var myObj, myJSON, text, obj;
function init(resultFromServer) {
     // Storing data:
     myObj = { country: resultFromServer.sys.country, city: resultFromServer.name, temperature: Math.floor(resultFromServer.main.temp),
         windsAt:  Math.floor(resultFromServer.wind.speed), humidityLevel: resultFromServer.main.humidity, description: resultFromServer.weather[0].description,
          longitude: Math.floor(resultFromServer.coord.lon), latitude: Math.floor(resultFromServer.coord.lat) };
     myJSON = JSON.stringify(myObj);
    
     localStorage.setItem("weatherJSON", myJSON);

    // Retrieving data:
    text = localStorage.getItem("weatherJSON");
    obj = JSON.parse(text);
    document.getElementById("searchInput").innerHTML = obj;

    console.log(resultFromServer);
    switch (resultFromServer.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = 'url("./images/clear.jpg")';
            break;

        case 'Clouds':
            document.body.style.backgroundImage = 'url("./images/cloudy.jpg")';
            break;

        case 'Rain':
        case 'Drizzle':
        case 'Mist':
            document.body.style.backgroundImage = 'url("./images/rain.jpg")';
            break;

        case 'Thunderstorm':
            document.body.style.backgroundImage = 'url("./images/storm.jpg")';
            break;

        case 'Snow':
            document.body.style.backgroundImage = 'url("./images/snow.jpg")';
            break;
    
        default:
            break;
    }

    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let temperatureElement = document.getElementById('temperature');
    let humidityElement = document.getElementById('humidity');
    let longitudeElement = document.getElementById('longitude');
    let latitudeElement = document.getElementById('latitude');
    let windSpeedElement = document.getElementById('windSpeed');
    let cityHeader = document.getElementById('cityHeader');
    let weatherIcon = document.getElementById('documentIconImg');

    weatherIcon.src = 'https://openweathermap.org/img/w/' + resultFromServer.weather[0].icon + '.png';

    let resultDescription = resultFromServer.weather[0].description;
    weatherDescriptionHeader.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);

    temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp) + '&#176' + 'c';
    windSpeedElement.innerHTML = 'Winds at ' + Math.floor(resultFromServer.wind.speed) + ' m/s';
    cityHeader.innerHTML = resultFromServer.name;
    humidityElement.innerHTML = 'Humidity levels at ' + resultFromServer.main.humidity + '%';
    longitudeElement.innerHTML = 'Longitude ' + Math.floor(resultFromServer.coord.lon) + '&#176';
    latitudeElement.innerHTML = 'Latitude ' + Math.floor(resultFromServer.coord.lat) + '&#176';

    setPositionForWeatherInfo();
}

function setPositionForWeatherInfo() {
    let weatherContainer = document.getElementById('weatherContainer');
    let weatherContainerHeight = weatherContainer.clientHeight;
    let weatherContainerWidth = weatherContainer.clientWidth;

    weatherContainer.style.left = `calc(50% - ${weatherContainerWidth/2}px)`;
    weatherContainer.style.top = `calc(50% - ${weatherContainerHeight/1.3}px)`;
    weatherContainer.style.visibility = `visible`;
}

document.getElementById('searchBtn').addEventListener('click', () => {
    let searchTerm = document.getElementById('searchInput').value;
    if(searchTerm)
        searchWeather(searchTerm);
})

