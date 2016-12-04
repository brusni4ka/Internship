const App = (function () {

    let pluginName = "WeatherWidget";
    let apiKeys = {
        weather_key: 'd934a70081a5cef84dd9dcbf3c0412ed',
        gtime_zone_key: 'AIzaSyBqO6Eblf3EeVW59nndnsXOjrdYtrFrIFU'
    };
    let defaults = {
        city_id: '',
        city: '',
        units: 'metric',
        remember: 'false',
        timezone: ''
    };
    let timeOut = {widget_id: '', clock_id: '', time: ''};


    //root element
    let element = null;
    let active_slide = '';
    let settings_list = null;
    //Local Storage key
    let storage = 'weatherWidget';
    let current_slide_num = 0;
    let weather_data = {
        city_id: '',
        city: '',
        state: '',
        units: '',
        descr: '',
        temp: '',
        tempF: '',
        speed: '',
        pressure: '',
        humidity: '',
        img_url: '',
        time: ''
    };

    let init = (el, options) => {
        element = (typeof el == 'string' || typeof el == 'number') ? document.getElementById(el) : el;
        settings_list = [Object.assign({}, defaults, options)];

        //If we have data in storage, we initialize widget with that data
        if (setSettingFromStorage()) {
            let len = settings_list.length;
            renderTemplate();
            debugger;
            renderSlides(len);
            updateWidget();
        } else {
            //We initialize widget with global data
            setSettingsByDefault()
                .then(()=> {
                    renderTemplate();
                    renderSlides(1);
                    updateWidget()
                });
        }

        eventsHolder();
    };


    function updateWidget() {
        //update in an hour
        let delay = (60 - (new Date().getMinutes())) * 60000;
        runWidget();

        if (timeOut.widget_id) {
            clearTimeout(parseInt(timeOut.widget_id));
        }

        let id = setTimeout(()=> {
            updateWidget();
        }, delay);

        timeOut.widget_id = id;
        timeOut.time = delay;
        console.dir(timeOut);
    }

    function updateTime(delayTime) {

        let time = weather_data.time;
        let delay = delayTime || (60000 - moment(time).seconds() * 60);

        if (timeOut.clock_id) {
            clearTimeout(parseInt(timeOut.clock_id));
        }

        let timeHolder = {
            time: moment(time).format("hh:mm a ").toUpperCase(),
            hours: moment(time).hour(),
            minutes: moment(time).minutes()
        };

        renderClock(timeHolder);

        let id = setTimeout(()=> {
            updateTime(60000);
        }, delay);


        weather_data.time = moment(time).add(1, 'minutes');
        timeOut.clock_id = id;
        console.dir(delay);
    }

    //combine function chane;
    function runWidget() {
        getWeather()
            .then((response) => {
                Object.assign(settings_list[current_slide_num], {city_id: response.weather.city_id});
                Object.assign(weather_data, response.weather);
                return getTimeZone(response.coord)
            })
            .then((zone)=> {
                let time = getTime(zone);
                Object.assign(settings_list[current_slide_num], {timezone: zone});
                Object.assign(weather_data, {time: time});
            })
            .then(()=> {
                renderWidget(weather_data);
                renderUnits(weather_data);
                renderDay();
                updateTime();
            });
    }


    //API FUNCTIONS
    function getLocation() {
        return fetch("http://ip-api.com/json")
            .then(data=>data.json())
            .then(json=> {
                return Promise.resolve(json);
            });
    }

    function getWeather() {
        //Getting the weather data from the open weather API
        let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${settings_list[current_slide_num].city}&appid=${apiKeys.weather_key}&units=metric`;
        return fetch(weatherUrl)
            .then(response => response.json())
            .then(response=> {
                return Promise.resolve({
                        weather: {
                            city_id: response.id,
                            city: response.name,
                            state: response.sys.country,
                            descr: response.weather[0].description,
                            tempC: response.main.temp,
                            tempF: response.main.temp * 9 / 5 + 32,
                            humidity: response.main.humidity,
                            pressure: response.main.pressure,
                            speed: response.wind.speed,
                            img_url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217538/' + response.weather[0].icon + '.png'
                        },
                        coord: {
                            lat: response.coord.lat,
                            lon: response.coord.lon
                        }
                    }
                );
            });
    }

    function getTimeZone(geodatas) {

        let timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?` +
            `location=${geodatas.lat},${geodatas.lon}&timestamp=1331161200&key=${apiKeys.gtime_zone_key}`;

        return fetch(timezoneUrl)
            .then(data=>data.json())
            .then(data=> {
                return Promise.resolve(data.timeZoneId)
            });
    }


    //HELPERS
    function getTime(zone) {
        return moment().tz(zone);
    }


    //SETTERS
    //sets global location data from api
    function setSettingsByDefault() {
        return new Promise((resolve, reject)=> {
            getLocation().then((data)=> {
                let globalData = {
                    city: data.city,
                    timezone: data.timezone
                };

                let settings = settings_list[0];
                //To Prevent from setting empty value
                for (var key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        if (!settings[key]) {
                            settings[key] = globalData[key];
                        }
                    }
                }
                resolve(settings);
            });
        })
    }

    function setSettingFromStorage() {
        let settings = JSON.parse(localStorage.getItem(storage));
        if (!settings || settings.length == 0)return false;
        settings_list = settings;
        return true;
    }

    function setSettings(data) {
        return Object.assign(settings_list[current_slide_num], data);
    }

    function setToLocalStorage(data) {

        if (typeof(Storage) === "undefined")return;

        let a = JSON.parse(localStorage.getItem(storage)) || [];

        //Prevent from pushing the same data
        let isNew = a.every((el)=> {
            return el.city_id !== data.city_id
        });
        if (!isNew)return;
        a.push(data);
        localStorage.clear(storage);
        localStorage.setItem(storage, JSON.stringify(a));
    }

    function clearLocalStorage(id) {
        let a = JSON.parse(localStorage.getItem(storage));
        a = a.filter((el)=> {
            return el.city_id != id;
        });
        localStorage.clear(storage);
        if (a.length > 0) {
            localStorage.setItem(storage, JSON.stringify(a));
        }
    }


    //RENDER FUNCTION
    function renderTemplate() {
        const template =
            `
       <div class="widget">
            <ul class="slider-pagi"></ul>
            <div class="slider" data-active="0">
            </div><!--end slider-->
          </div>`;
        if (!element.classList.contains('done')) {
            element.style.height = '100%';
            element.innerHTML = template;
            element.classList.add('done');
        }
    }

    function renderSlides(count) {
        const slider = element.getElementsByClassName('slider')[0];
        const length = slider.childElementCount || 0;
        const slideHtml = `
                 <div class="visual">
                  <div class="bg-wrap">
                    <div class="circle-day"></div>
                  </div>
                  <svg class='sun' version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                    <circle fill="#FFDB4D"  cx="-20" cy="100%" r="12" >
                     
                      <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="rotate"
                        fill="freeze" 
                        />
                    </circle>
                  </svg>
                </div>
                <div class="info">
                  <div class="btn-holder">
                    <a href="#" class="rounded-btn"></a>
                  </div>
                  <div class="search-holder">
                    <div class="capture">
                      <form class="search-form">
                        <div class="div">
                          <label for="city">Weather in ...</label>
                          <div class="input-holder">
                            <input class="city" type="text" placeholder="">
                            <a type="submit" class="search-btn fa fa-search" aria-hidden="true"></a>
                          </div>
                        </div>
                      </form>
                      <div class="buttons">
                      <!--buttons go here-->
                      </div>
                    </div>
                    <div class="remember">
                      <label for="remember">remember me</label>
                      <input id="remember" class="remember_location" type="checkbox">
                    </div>
                    <span class="arrow"></span>
                  </div>
                  <div class="geo-info">
                    <div class="clock" data-time="">
                      <div class="minutes-container">
                        <div class="minutes"></div>
                      </div>
                      <div class="hours-container">
                        <div class="hours"></div>
                      </div>
                    </div>
                    <span class="location"></span>
                  </div>
          
                  <div class="meteo-info">
                  </div>
                </div>
              `;
        for (let i = 0, val = length; i < count; i++, val++) {
            let slide = document.createElement('div');
            slide.innerHTML = slideHtml;
            slide.classList.add('slide');
            slide.classList.add(`weather_${val}`);
            slider.appendChild(slide);
            addAutocomplete(slide);
        }
        renderSlider();
    }

    function renderSlider() {

        let slider = element.getElementsByClassName('slider')[0];
        let pagination = element.getElementsByClassName('slider-pagi')[0];
        let numOfSlides = slider.childElementCount - 1;

        let curSlide = current_slide_num;


        function createBullets() {
            pagination.innerHTML = '';
            for (let i = 0; i < numOfSlides + 1; i++) {
                let li = document.createElement('li');
                li.classList.add('slider-pagi__elem');
                li.classList.add(`slider-pagi__elem-${i}`);
                li.setAttribute('data-page', i);
                if (!i) li.classList.add('active');
                pagination.appendChild(li);
            }
        }

        createBullets();
        changeSlides(curSlide);

        // element.getElementsByClassName(`weather_${curSlide}`)[0].classList.add('active');
    }

    function changeSlides(num) {

        const curSlide = num;
        const slider = element.getElementsByClassName('slider')[0];
        const elementWidth = element.getElementsByClassName('slide')[0].offsetWidth;
        const slides = element.getElementsByClassName("slide");
        const pagies = element.getElementsByClassName('slider-pagi__elem');

        slider.classList.add('animating');
        slider.setAttribute('data-active', curSlide);
        removeActive(slides);
        element.getElementsByClassName(`weather_${curSlide}`)[0].classList.add('active');
        removeActive(pagies);
        element.getElementsByClassName(`slider-pagi__elem-${curSlide}`)[0].classList.add('active');
        slider.style.transform = "translateX(" + -curSlide * elementWidth + "px)";
    }

    function removeActive(elems) {
        [].forEach.call(elems, (el)=> {
            el.classList.remove('active');
        })
    }

    function renderWidget(dataWeather) {
        const ischecked = settings_list[current_slide_num].remember;
        const meteo_info = `<img class="weather-icon" src= "${dataWeather.img_url}" alt="icon">
              <div class="weather">
                <div class="descr">${dataWeather.descr}</div>
                <div class="temp"></div>
                <div class="other-inf">
                  <span class="humidity">${dataWeather.humidity}&#176;</span>
                  <span class="pressure">${dataWeather.pressure}&#176;</span>
                </div>
                <span class="wind">Winds: ${dataWeather.speed} MPH</span>
              </div>`;


        active_slide = element.querySelector('.slide.active');

        if (ischecked == true) {
            active_slide.classList.add('pin');
            active_slide.querySelector('#remember').setAttribute('checked', 'true');
        } else {
            active_slide.querySelector('#remember').removeAttribute('checked');
        }

        const location = active_slide.querySelector('.location');
        location.innerHTML = `${dataWeather.city}, ${dataWeather.state}`;
        location.setAttribute("data-ci", dataWeather.city_id);

        active_slide.querySelector('.meteo-info').innerHTML = meteo_info;
    }

    function renderUnits(dataWeather) {
        const activeUnit = settings_list[current_slide_num].units;
        let metric;
        let imperial;
        let temp;
        if ('metric' === activeUnit) {
            metric = 'active';
            imperial = '';
            temp = dataWeather.tempC;
        } else {
            metric = '';
            imperial = 'active';
            temp = dataWeather.tempF;
        }

        const buttons = `
                  <button id="C" data-unit="metric" class="unit-btn ${metric}">&#176C</button>
                  <button id="F" data-unit="imperial" class="unit-btn ${imperial}">&#176F</button>`;
        const buttonsNode = active_slide.getElementsByClassName('buttons')[0];
        const temperatureNode = active_slide.getElementsByClassName('temp')[0];

        buttonsNode.innerHTML = buttons;

        temperatureNode.innerHTML = Math.ceil(temp) + '&#176';
    }

    function renderDay() {
        const time = weather_data.time;
        const hours = moment(time).hours();
        const sun_angle = (hours - 9) * 30;

        let dayClass = '';

        const dayElements = [
            element,
            active_slide.getElementsByClassName('btn-holder')[0],
            active_slide.getElementsByClassName('circle-day')[0],
            active_slide.getElementsByClassName('bg-wrap')[0],
            active_slide.getElementsByClassName('visual')[0]
        ];

        const dayList = [
            'morning',
            'day',
            'evening',
            'night'
        ];

        if (hours > 5 && hours < 12) {
            dayClass = 'morning';

        } else if (hours >= 11 && hours <= 17) {
            dayClass = 'day';
        } else if (hours > 17 && hours < 24) {
            dayClass = 'evening';
        } else {
            dayClass = 'night';
        }


        const sun = active_slide.getElementsByClassName('sun')[0]
            .getElementsByTagName('animateTransform')[0];
        sun.setAttribute('from', `${sun_angle - 60} 50 100`);
        sun.setAttribute('to', `${sun_angle} 50 100`);


        dayElements.forEach((el)=> {
            dayList.forEach((day)=> {
                el.classList.remove(day);
            });
            el.classList.add(dayClass);
        });
    }

    function renderClock(timeHolder) {
        const clock = active_slide.getElementsByClassName('clock')[0];
        clock.setAttribute('data-time', timeHolder.time);

        let hands = [
            {
                hand: 'hours',
                angle: (timeHolder.hours * 30) + (timeHolder.minutes / 2)
            },
            {
                hand: 'minutes',
                angle: (timeHolder.minutes * 6)
            }
        ];

        hands.forEach((elem)=> {
            clock.getElementsByClassName(elem.hand)[0].style.transform = 'rotateZ(' + elem.angle + 'deg)';
        });

    }

    function eventsHolder() {

        const eventHolder = {

            'rounded-btn': () => {
                let el = active_slide.getElementsByClassName('search-holder')[0];
                el.classList.toggle('active');
            },

            'arrow': () => {
                let rememberBlock = active_slide.getElementsByClassName('remember')[0];
                rememberBlock.classList.toggle('active');

            },

            'search-btn': () => {
                let city = active_slide.getElementsByClassName('city')[0].value.split(',').shift();
                if (!city)return;

                if (active_slide.classList.contains('pin')) {
                    //new element
                    settings_list.push(Object.assign({}, defaults));
                    current_slide_num = settings_list.length - 1;

                    setSettings({city: city});
                    renderSlides(1);

                } else {
                    setSettings({city: city});
                }
                updateWidget();
            },

            'unit-btn': (elem) => {
                debugger;
                let unit = elem.getAttribute('data-unit');
                setSettings({units: unit});
                renderUnits(weather_data);
            },

            'remember_location': (elem) => {
                // let elem = event.target;
                if (elem.checked) {
                    active_slide.classList.add('pin');
                    setSettings({'remember': true});
                    setToLocalStorage(settings_list[current_slide_num]);
                } else {
                    active_slide.classList.remove('pin');
                    setSettings({'remember': false});
                    let id = weather_data.city_id;
                    clearLocalStorage(id);
                }
            },

            'slider-pagi__elem': (elem)=> {

                let curSlide = elem.getAttribute("data-page") || elem.getAttribute("data-page");
                current_slide_num = curSlide;

                changeSlides(curSlide);
                debugger;
                if (active_slide &&
                    active_slide.querySelector('.location').getAttribute('data-ci') !== settings_list[current_slide_num].city_id) {
                    updateWidget();
                }
            }

        };

        element.addEventListener('click', event => {
            event.stopPropagation();
            event.preventDefault();

            let el = event.target;

            for (let key in eventHolder) {
                if (eventHolder.hasOwnProperty(key)) {
                    if (el.classList.contains(key)) {
                        eventHolder[key](el);
                    }
                }

            }

        });
        element.addEventListener('submit', event => {
            event.stopPropagation();
            event.preventDefault();
            eventHolder['search-btn']();

        });
        element.addEventListener('keyUp', event => {
            event.stopPropagation();
            event.preventDefault();
            eventHolder['search-btn']();

        });

    }

    function addAutocomplete(node){
        let autocomplete = new google.maps.places.Autocomplete(
            node.getElementsByClassName('city')[0], {
                types: ['(cities)']
            });
    }



    //EVENTS
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