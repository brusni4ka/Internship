import Store from './Base/Store/Store';
import Dispatcher from './Base/Dispatcher/Dispatcher';

//Import Api
import Geo from './api/Geo';
import TimeZone from './api/Timezone';
import Weather from './api/Weather';

//import Views
import ViewWeather from './Base/views/ViewWeather';

export let App = (function () {
    let store = new Store('widget');
    let geoApi = new Geo();
    let timeZone = new TimeZone();
    let weatherApi = new Weather();
    let dispatcher = new Dispatcher();
    let view = new ViewWeather();
    let node = '';


    let start = function (el) {
        node = document.getElementsByClassName(el)[0];
        view.setNode(node);
       
        view.renderTemplate();
        
        store.addListener('UPDATED', view.render.bind(view));
        store.addListener('UPDATED', view.renderDay.bind(view));
        

        dispatcher.register(function (payload) {
            switch (payload.type) {
                case 'UPDATE_STORE' :
                    Object.assign(store, payload.params);
                    break;

                case 'ADD_WEATHER' :
                    store.setWeatherData(payload.params);
                    let data = store.getState();
                    debugger;
                    store.emit('UPDATED', data.weather);
                    break;

                case 'ADD_TIME' :
                    //store.addTimeData(payload.params);
                    break;

                default:
                    break;
            }
        });

        geoApi._getLocation('Харьков')
            .then((response)=> {
                return Promise.all([
                    timeZone.getTimeZone(response),
                    weatherApi.getWeatherData(response)
                ])
            })
            .then((response) => {

                let time = moment().tz(response[0].timeZoneId);
                let data = Object.assign(response[1],{time: time});
                console.log(data);
                dispatcher.dispatch({
                    type: 'ADD_WEATHER',
                    params: data
                });

                console.dir(store.getState());
            });

        eventsHolder();
        
    };



    function eventsHolder() {
       /* let searchEvHandler = function (event) {

            let _this = event.data;
            let elem = $(event.target);
            //get first city element

            let city = ($.trim($(_this.active_slide).find('input.city').val())).split(',').shift();
            event.preventDefault();
            if (!city)return;

            if (elem.closest('.slide').hasClass('pin')) {
                //new element
                _this.settings_list.push(Object.assign({}, defaults));
                _this.current_slide_num = _this.settings_list.length - 1;

                //_this.setSettings(defaults);
                _this.setSettings({city: city});
                _this.renderSlides(1);
            } else {
                _this.setSettings({city: city});
            }
            _this.updateWidget();
        };
        node.getElementsByClassName('search-btn')[0].addEventListener('click',()=>{

        });
        node.on('click', '.search-btn', this, searchEvHandler);*/


        node.getElementsByClassName('rounded-btn')[0].addEventListener("click", (event)=> {
            event.preventDefault();

            let el = node.getElementsByClassName('search-holder')[0];
            debugger;
            el.style.display = (el.style.display != 'none' ? 'none' : '' );
        });


    }






    return {
        start: start
    }

}());