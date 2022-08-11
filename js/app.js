/*
    OpenWeather - https://openweathermap.org
    API call : https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&lang={lang}&exclude={part}&appid={API key}
    API DOC : https://openweathermap.org/api/one-call-3
*/

const API_PARAM = {
    appid : '', // Your API Key
    lang: 'fr', // langage
    exclude: 'minutely' //exclude some parts ot the weather data (current,minutely,hourly,daily,alerts)
}

