/*
    OpenWeather - https://openweathermap.org
    API call : https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&lang={lang}&exclude={part}&appid={API key}
    API DOC : https://openweathermap.org/api/one-call-3
*/

const API_PARAM = {
    appid : '', // Your API Key
    lang: 'fr', // langage
    exclude: 'minutely', //exclude some parts ot the weather data (current,minutely,hourly,daily,alerts)
    lat: 0, // default latitude
    lon: 0 // default longitude
}

const ERROR_BOX = document.querySelector(".error-box");

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
}
else{
    ERROR_BOX.textContent = 'Votre navigateur ne prends pas en charge la géolocalisation.';
}

function positionSuccess(pos){
    API_PARAM.lat = pos.coords.latitude;
    API_PARAM.lon = pos.coords.longitude;
    console.log(API_PARAM.lat, API_PARAM.lon)
}

function positionError(err){
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