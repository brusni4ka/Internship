import Store from './Base/Store';
import Dispatcher from './Base/Dispatcher';

//Import Api
import Geo from './api/Geo';
import TimeZone from './api/Timezone';
import Weather from './api/Weather';

//import Container
import Container from './Container';

//import animation
import {anim} from './animation';

let App = (function () {
    const store = new Store('widget');
    const geoApi = new Geo();
    const timeZone = new TimeZone();
    const weatherApi = new Weather();
    const dispatcher = new Dispatcher();

    var node = '';

    let init = function (el) {

        node = (typeof el == 'string' || typeof el == 'number') ? document.getElementById(el) : el;
        debugger;
        //setting our node parent element
        const container = new Container(node);

        store.addListener('UPDATED', container.render.bind(container));

        dispatcher.register(function (payload) {
            let data = '';
            switch (payload.type) {
                case 'UPDATE_STORE' :
                    store.setData(payload.params);
                    //Object.assign(store, payload.params);
                    break;

                case 'ADD_WEATHER' :
                    store.setData(payload.params);
                    data = store.getState();
                    debugger;
                    store.emit('UPDATED', data);
                    break;

                case 'GET_WEATHER_BY_CITY':
                    geoApi.getLocation(payload.params)
                        .then((response)=> {
                            return Promise.all([
                                timeZone.getTimeZone(response),
                                weatherApi.getWeatherData(response)
                            ])
                        })
                        .then((response) => {
                            let time = moment().tz(response[0].timeZoneId);
                            let data = Object.assign(response[1], {time: time});
                            store.setData(data);
                            store.emit('UPDATED', data);
                        });
                    break;
                
                case 'ADD_TIME' :
                    //store.addTimeData(payload.params);
                    break;

                case 'CHANGE_UNIT':
                    store.setData({temp: {unit: payload.params}});
                    data = store.getState();
                    debugger;
                    store.emit('UPDATED', data);
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

            });

    }

    function eventsHolder() {

        // let node = this.node;

        const eventHolder = {
            
            'rounded-btn': () => {
                let el = node.getElementsByClassName('search-holder')[0];
                anim.slideToggle(el);
            },

            'arrow': () => {
                let rememberBlock = node.getElementsByClassName('remember')[0];
                anim.slideToggle(rememberBlock);
            },
            'remember': () => {

            },
            
            'search-btn': () => {
                let city = node.getElementsByClassName('city')[0].value.split(',').shift();
                if (!city)return;
                run(city);
            }
           /* 'unit-btn': () => {
                let unit = event.target.getAttribute('data-unit');
                
                dispatcher.dispatch({
                    type: 'CHANGE_UNIT',
                    params: unit
                })
            }*/
        };
        

        node.addEventListener('click', event => {
            event.stopPropagation();
            let el = event.target;

            for (let key in eventHolder) {
                if (eventHolder.hasOwnProperty(key)) {
                    if (el.classList.contains(key)) {
                        eventHolder[key]();
                    }
                }

            }

        });

    }

    return {
        init: init
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