/**
 * Created by kate on 25/11/16.
 */
import Config from '../config';

export  default class Weather {

    constructor() {
    }

    //Getting the weather data from the open weather API
    getWeatherData(data) {

        let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lng}&appid=${Config.WEATHER_API_KEY}&units=metric`;
        return fetch(weatherUrl)
            .then(response => response.json())
            .then(response=> {
                return Promise.resolve({
                        weather: {
                            city_id: response.id,
                            city: response.name,
                            state: response.sys.country,
                            descr: response.weather[0].description,
                            humidity: response.main.humidity,
                            pressure: response.main.pressure,
                            speed: response.wind.speed,
                            img_url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217538/' + response.weather[0].icon + '.png'
                        },
                        temp: {
                            tempC: response.main.temp,
                            tempF: response.main.temp * 9 / 5 + 32,
                            unit: 'metric'
                        }
                    }
                );
            });
    }

}