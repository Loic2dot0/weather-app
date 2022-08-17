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
    console.log(API_PARAM.lat, API_PARAM.lon);
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
                res.json().then(res => {
                    LOADER.textContent = '';
                    console.log(res);
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