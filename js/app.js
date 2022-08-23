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
    ERROR_BOX.classList.add('error-box--active');
}

function positionSuccess(pos){
    LOADER.textContent = '';
    API_PARAM.lat = pos.coords.latitude;
    API_PARAM.lon = pos.coords.longitude;
    weatherApiCall();
}

function positionError(err){
    LOADER.textContent = '';
    ERROR_BOX.classList.add('error-box--active');
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
                ERROR_BOX.classList.add('error-box--active');
            }
        })
        .catch(err => {
            console.log(err);
            LOADER.textContent = '';
            ERROR_BOX.textContent = "Oups... Une erreur est survenue";
            ERROR_BOX.classList.add('error-box--active');
        });
}

const CURRENT_WEATHER = document.querySelector(".current-weather");

function showCurrentWeather(data){
    let hour = new Date().getHours();
    let today = new Date().toLocaleString("fr-FR",{year: 'numeric', month: 'long', day: 'numeric'});
    let weekday =  new Date().toLocaleString("fr-FR",{weekday: 'long'});
    let currentWeather = {
        temp: `${Math.round(data.temp)}°`,
        feelsLike: `${Math.round(data.feels_like)}°`,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        id: data.weather[0].id
    }

    document.querySelector(".current-weather_lite img").setAttribute("src", `style/img/${currentWeather.icon}.svg`);
    document.querySelector(".current-weather_temp").textContent = currentWeather.temp;
    document.querySelector(".current-weather_weekday").textContent = weekday;
    document.querySelector(".current-weather_today").textContent = today;
    document.querySelector(".current-weather_description").innerHTML = `${currentWeather.description }<br>Température ressentie: ${currentWeather.feelsLike}`;

    if(hour >= 21 || hour <= 7){
        CURRENT_WEATHER.classList.add(".current-weather--night");
    }
    else{
        CURRENT_WEATHER.classList.remove(".current-weather--night");

        if(currentWeather.id == 800) CURRENT_WEATHER.style.background = 'linear-gradient(45deg, #73b5ef, #c5d8e8)';
        
        if(currentWeather.id > 800) CURRENT_WEATHER.style.background = 'linear-gradient(45deg, #c9c9c9, #f9f9f9)';

        if(currentWeather.id < 800) CURRENT_WEATHER.style.background = 'linear-gradient(45deg, #8d8d8d, #f1f1f1)';
    }
}

const HOURLY_WEATHER = document.querySelector(".hourly-weather");

function handleHourlyWeather(data){
    for(let i = 0; i < 7; i++){
        let hour = new Date(data[i].dt*1000).getHours();
        let li = document.createElement('li');
        li.innerHTML = `
            ${hour}h<br>
            <img src="style/img/${data[i].weather[0].icon}.svg" ><br>
            ${Math.round(data[i].temp)}°`;
        if(hour >= 21 || hour <= 7) {
            li.classList.add("night");
        }
        HOURLY_WEATHER.appendChild(li);
    }
}

const DAILY_WEATHER = document.querySelector(".daily-weather");
const DAY_NAME = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

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