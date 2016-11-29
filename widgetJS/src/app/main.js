import Store from './Base/Store/Store';
import Dispatcher from './Base/Dispatcher/Dispatcher';

//Import Api
import Geo from './api/Geo';
import TimeZone from './api/Timezone';
import Weather from './api/Weather';

//import Views
import ViewWeather from './Base/components/ViewWeather';

//import Container
import Container from './Base/Container/Container';



//import animation
import {anim} from './animation';

let App = (function () {
    let store = new Store('widget');
    let geoApi = new Geo();
    let timeZone = new TimeZone();
    let weatherApi = new Weather();
    let dispatcher = new Dispatcher();
    let view = new ViewWeather();
    let container = new Container();

    let node = null;


    let start = function (el) {
        node = document.getElementsByClassName(el)[0];
        container.setNode(node);
        view.renderTemplate();

        store.addListener('UPDATED', container.setState.bind(view));
      /*  store.addListener('UPDATED', view.renderDay.bind(view));
        store.addListener('UPDATED', view.renderUnits.bind(view));
        store.addListener('UPDATED', view.renderClock.bind(view));*/


        store.addListener('UNIT_UPDATED', view.renderUnits.bind(view));


        dispatcher.register(function (payload) {
            let data = '';
            switch (payload.type) {
                case 'UPDATE_STORE' :
                    Object.assign(store, payload.params);
                    break;

                case 'ADD_WEATHER' :
                    store.setWeatherData(payload.params);
                    data = store.getState();
                    store.emit('UPDATED', data);
                    break;

                case 'ADD_TIME' :
                    //store.addTimeData(payload.params);
                    break;

                case 'CHANGE_UNIT':
                    store.setWeatherData({unit: payload.params});
                    data = store.getState();
                    store.emit('UNIT_UPDATED', data);
                    break;

                default:
                    break;
            }
        });

        run();
        eventsHolder();
    };



    function run(city) {
        geoApi.getLocation(city)
            .then((response)=> {
                return Promise.all([
                    timeZone.getTimeZone(response),
                    weatherApi.getWeatherData(response)
                ])
            })
            .then((response) => {
                let time = moment().tz(response[0].timeZoneId);
                let data = Object.assign(response[1], {time: time});
                console.log(data);
                dispatcher.dispatch({
                    type: 'ADD_WEATHER',
                    params: data
                });
                dispatcher.dispatch({
                    type: 'ADD_TIME',
                    params: data
                });

                console.dir(store.getState());
            });

    }



    function eventsHolder() {


        let btn = node.getElementsByClassName('rounded-btn')[0];
        let el = node.getElementsByClassName('search-holder')[0];
        let arrow = node.getElementsByClassName('arrow')[0];
        let rememberBlock = node.getElementsByClassName('remember')[0];
        let searchBtn = node.getElementsByClassName('search-btn')[0];
        let unitBtn = node.getElementsByClassName('buttons')[0];


        arrow.onclick = function () {
            event.stopPropagation()
            anim.slideToggle(rememberBlock);
        };

        btn.onclick = function () {
            event.stopPropagation()
            anim.slideToggle(el);
        };

        searchBtn.onclick = function () {

            event.preventDefault();
            let city = document.getElementsByClassName('city')[0].value.split(',').shift();
            if (!city)return;

            run(city);
        };

        unitBtn.onclick = function () {
            let unit = event.target.getAttribute('data-unit');
            debugger;
            dispatcher.dispatch({
                type: 'CHANGE_UNIT',
                params: unit
            })
            ;
            /*_this.setSettings({units: unit});
             _this.renderUnits(_this.weather_data);*/
        };


        /*
         node.getElementsByClassName('rounded-btn')[0].addEventListener("click", (event)=> {
         event.preventDefault();

         let el = node.getElementsByClassName('search-holder')[0];
         debugger;
         el.style.display = (el.style.display != 'none' ? 'none' : '' );
         });
         */


    }


    return {
        start: start
    }

}());

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, App));