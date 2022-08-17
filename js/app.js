/*
    OpenWeather - https://openweathermap.org
    API call : https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&lang={lang}&exclude={part}&appid={API key}
    API DOC : https://openweathermap.org/api/one-call-3
*/

const API_PARAM = {
    appid : '', // Your API Key
    lang: 'fr', // langage
    exclude: 'minutely', //exclude some parts of the weather data (current,minutely,hourly,daily,alerts)
    units: 'metric', // standard, metric or imperial
    lat: 0, // default latitude
    lon: 0 // default longitude
}

const ERROR_BOX = document.querySelector(".error-box");
const LOADER = document.querySelector(".loader");

LOADER.textContent = 'Obtention de votre localisation en cours...';

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
}
else{
    ERROR_BOX.textContent = 'Votre navigateur ne prends pas en charge la géolocalisation.';
}

function positionSuccess(pos){
    LOADER.textContent = '';
    API_PARAM.lat = pos.coords.latitude;
    API_PARAM.lon = pos.coords.longitude;
    weatherApiCall();
}

function positionError(err){
    LOADER.textContent = '';
    switch(err.code){
        case 1:
            ERROR_BOX.textContent = "Vous n'avez pas autorisé la géolocalisation.";
            break;
        case 2:
            ERROR_BOX.textContent = "Oups... Une erreur est survenue";
            break;
        case 3:
            ERROR_BOX.textContent = "Le délai d'obtention de votre localisation est dépassé.";
            break;
        default:
            ERROR_BOX.textContent = "Oups... Une erreur est survenue";
            break;
    }
}


function weatherApiCall(){
    LOADER.textContent = 'Récupération des données météo en cours...';

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${API_PARAM.lat}&lon=${API_PARAM.lon}&lang=${API_PARAM.lang}&units=${API_PARAM.units}&exclude=${API_PARAM.exclude}&appid=${API_PARAM.appid}`)
        .then(res => {
            if(res.ok){
                res.json().then(data => {
                    LOADER.textContent = '';
                    showCurrentWeather(data.current);
                    handleHourlyWeather(data.hourly);
                    handleDailyWeather(data.daily);
                });
            }
            else {
                LOADER.textContent = '';
                ERROR_BOX.textContent = `Oups... Erreur ${res.status}.`;
            }
        })
        .catch(err => {
            console.log(err);
            LOADER.textContent = '';
            ERROR_BOX.textContent = "Oups... Une erreur est survenue";
        });
}

function showCurrentWeather(data){
    let currentWeather = {
        temp: `${Math.round(data.temp)}°`,
        feelsLike: `${Math.round(data.feels_like)}°`,
        icon: data.weather[0].icon,
        description: data.weather[0].description
    }
    document.querySelector(".current-weather_ico").innerHTML = `<img src="style/img/${currentWeather.icon}.svg" alt="icone météo">`;
    document.querySelector(".current-weather_temp").textContent = currentWeather.temp;
    document.querySelector(".current-weather_description").innerHTML = `${currentWeather.description }<br>Température ressentie: ${currentWeather.feelsLike}`;
}

const HOURLY_WEATHER = document.querySelector(".hourly-weather");

function handleHourlyWeather(data){
    for(let i = 0; i < 7; i++){
        let li = document.createElement('li');
        li.innerHTML = `
            ${new Date(data[i].dt*1000).getHours()}H<br>
            <img src="style/img/${data[i].weather[0].icon}.svg" ><br>
            ${Math.round(data[i].temp)}°`;
        HOURLY_WEATHER.appendChild(li);
    }
}

const DAILY_WEATHER = document.querySelector(".daily-weather");
const DAY_NAME = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function handleDailyWeather(data){
    for(let i = 0; i < 7; i++){
        let day = DAY_NAME[new Date(data[i].dt*1000).getDay()];
        let li = document.createElement('li');
        li.innerHTML = `
            ${day}<br>
            <img src="style/img/${data[i].weather[0].icon}.svg" ><br>
            ${Math.round(data[i].temp.day)}°`;
            DAILY_WEATHER.appendChild(li);
    }
}