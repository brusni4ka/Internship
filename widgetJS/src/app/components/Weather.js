/**
 * Created by kate on 29/11/16.
 */
import View from '../Base/View';
 
export  default class Weather extends View {
   
    state = {};

    render() {
        console.log('weather render');
        const { weather } = this.state;
        const {
            img_url,
            descr,
            humidity,
            pressure,
            speed,
            city,
            city_id,
            state,
        } = weather;
        const node = View._node;

        let meteoNode = node.getElementsByClassName('meteo-info')[0];
        let location = document.getElementsByClassName('location')[0];
        let meteoInfo = `<img class="weather-icon" src= "${img_url}" alt="icon">
              <div class="weather">
                <div class="descr">${descr}</div>
                <div class="temp"></div>
                <div class="other-inf">
                  <span class="humidity">${humidity}&#176;</span>
                  <span class="pressure">${pressure}&#176;</span>
                </div>
                <span class="wind">Winds: ${speed} MPH</span>
              </div>`;

        meteoNode.innerHTML = meteoInfo;
        location.innerText = `${city}, ${state}`;
        location.setAttribute("data-ci", city_id);
    };

    mapDataToState({weather}) {
        return { weather }
    };

    shouldViewUpdate(data) {
       
        let isStateChanged = false;
        Object.keys(data).forEach(dataKey => {
            if (data[dataKey] !== this.state[dataKey] && data[dataKey]) {
                isStateChanged = true;
            }
        });
        return isStateChanged;
    };
}