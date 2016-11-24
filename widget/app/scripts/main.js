/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
;(function ($, window, document, undefined) {

    "use strict";

    var pluginName = "WeatheWidget";

    var apiKeys = {
        weather_key: 'd934a70081a5cef84dd9dcbf3c0412ed',
        gtime_zone_key: 'AIzaSyBqO6Eblf3EeVW59nndnsXOjrdYtrFrIFU'
    };

    var defaults = {
        city_id: '',
        city: '',
        units: 'metric',
        remember: 'false',
        timezone: ''
    };

    var timeOut = {widget_id: '', clock_id: '', time: ''};

    var autocompleteOptions = {
        serviceUrl: "http://gd.geobytes.com/AutoCompleteCity?callback=?",
        dataType: 'jsonp',
        paramName: 'q',
        transformResult: responce => 0|| {suggestions: responce},
        minChars: 3,
        deferRequestBy: 0
    };

    // The actual plugin constructor
    function Plugin(element, options) {

        Object.assign(this, {
            name: pluginName,
            //root element
            element: element,
            active_slide: '',
            settings_list: [Object.assign($.extend({}, defaults, options))],
            //Local Storage key
            storage: 'weatherWidget',
            current_slide_num: 0,
            weather_data: {
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
            }
        });
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {

        init: function () {
            //If we have data in storage, we initialize widget with that data
            if (this.setSettingFromStorage()) {
                let len = this.settings_list.length;
                this.renderTemplate();
                this.renderSlides(len);
                this.updateWidget();
            } else {
                //We initialize widget with global data
                this.setSettingsByDefault()
                    .then(()=> {
                        this.renderTemplate();
                        this.renderSlides(1);
                        this.updateWidget()
                    });
            }
            this.registerEvents();
        },

        //combine function chane;
        runWidget(){
            this.getWeather()
                .then((response) => {
                    Object.assign(this.settings_list[this.current_slide_num], {city_id: response.weather.city_id});
                    Object.assign(this.weather_data, response.weather);
                    return this.getTimeZone(response.coord)
                })
                .then((zone)=> {
                    let time = this.getTime(zone);
                    Object.assign(this.settings_list[this.current_slide_num], {timezone: zone});
                    Object.assign(this.weather_data, {time: time});
                })
                .then(()=> {
                    /* if (!this.isNewCityId(this.weather_data.city_id)) {
                     return false;
                     }*/
                    this.renderWidget(this.weather_data);
                    this.renderUnits(this.weather_data);
                    this.renderDay();
                    this.updateTime();
                    this.addAutocomplete();
                });
        },


        //check if it's new city
        isNewCityId(id){
            let fl = true;
            $(this.element).find('.location').each(function () {
                debugger;
                if ($(this).data('ci') == id) {
                    fl = false;
                }
            });
            return fl;
        },

        updateWidget(){

            //update in an hour
            let delay = (60 - (new Date().getMinutes())) * 60000;
            this.runWidget();

            if (timeOut.widget_id) {
                clearTimeout(parseInt(timeOut.widget_id));
            }

            let id = setTimeout(()=> {
                this.updateWidget();
            }, delay);

            timeOut.widget_id = id;
            timeOut.time = delay;
            console.dir(timeOut);
        },

        getWeather () {
            //Getting the weather data from the open weather API
            let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${this.settings_list[this.current_slide_num].city}&appid=${apiKeys.weather_key}&units=metric`;

            return new Promise((resolve, reject) => {
                $.getJSON(weatherUrl)
                    .done(function (response) {
                        resolve({
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
                        });
                    });
            });
        },

        getTime(zone){
            console.log(3, 'getTime');
            console.log(zone);
            return moment().tz(zone);

        },

        getTimeZone(geodatas){
            let timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?` +
                `location=${geodatas.lat},${geodatas.lon}&timestamp=1331161200&key=${apiKeys.gtime_zone_key}`;
            console.log('2', timezoneUrl);

            return new Promise((resolve, reject) => {
                $.getJSON(timezoneUrl)
                    .done(function (data) {
                        console.log('2', data.timeZoneId);
                        resolve(data.timeZoneId);
                    });
            });
        },

        updateTime(delayTime){

            let time = this.weather_data.time;
            let delay = delayTime || (60000 - moment(time).seconds() * 60);

            console.log(delay);

            if (timeOut.clock_id) {
                clearTimeout(parseInt(timeOut.clock_id));
            }

            let timeHolder = {
                time: moment(time).format("hh:mm a ").toUpperCase(),
                hours: moment(time).hour(),
                minutes: moment(time).minutes()
            };

            this.renderClock(timeHolder);


            let id = setTimeout(()=> {
                this.updateTime(60000);
            }, delay);


            this.weather_data.time = moment(time).add(1, 'minutes');
            timeOut.clock_id = id;
            console.dir(delay);
        },

        /* renderNewSlide(l){
         if (!this.active_slide)return;
         let length = $(this.element).find('.slider').children().length;
         if (length === this.settings_list.length)return;
         for(var i=1; i<l; i++,length++){
         $(`<div class="slide weather_${length}">`).append($('.slide').html()).appendTo('.slider');
         this.active_slide = $(`.slide.weather_${length}`);
         }
         this.renderSlider();
         },*/

        renderTemplate(){

            let template =
                `
       <div class="widget">
            <ul class="slider-pagi"></ul>
            <div class="slider" data-active="0">
            </div><!--end slider-->
          </div>`;
            if (!$(this.element).hasClass('done')) {
                $(this.element).html(template);
                $(this.element).addClass('done');
                // $(this.element).find('.slide').addClass('active')
            }

        },

        renderSlides(count){
            let length = $(this.element).find('.slider').children().length || 0;
            let slide = `<div class="slide">
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
                          <input class="city" type="text" placeholder="">
                        </div>
                      </form>
                      <div class="buttons">
                      <!--buttons go here-->
                      </div>
                    </div>
                    <div class="remember">
                      <label for="remember">remember me</label>
                      <input id="remember" type="checkbox">
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
              </div>`;
            for (var i = 0, val = length; i < count; i++, val++) {
                $(slide).addClass(`weather_${val}`).appendTo('.slider');
            }
            this.renderSlider();
        },

        renderWidget (dataWeather) {

            let ischecked = this.settings_list[this.current_slide_num].remember;
            console.log('ischecked', ischecked);
            let meteo_info = `<img class="weather-icon" src= "${dataWeather.img_url}" alt="icon">
              <div class="weather">
                <div class="descr">${dataWeather.descr}</div>
                <div class="temp"></div>
                <div class="other-inf">
                  <span class="humidity">${dataWeather.humidity}&#176;</span>
                  <span class="pressure">${dataWeather.pressure}&#176;</span>
                </div>
                <span class="wind">Winds: ${dataWeather.speed} MPH</span>
              </div>`;


            this.active_slide = $(this.element).find('.slide.active');

            if (ischecked == true) {
                this.active_slide.addClass('pin');
                this.active_slide.find('#remember').attr('checked', 'true');
            } else {
                this.active_slide.find('#remember').removeAttr('checked');
            }

            this.active_slide.find('.location')
                .html(`${dataWeather.city}, ${dataWeather.state}`)
                .attr("data-ci", dataWeather.city_id);

            this.active_slide.find('.meteo-info').html(meteo_info);

        },

        renderUnits(dataWeather){
            this.active_slide = $('.slide.active');
            let activeUnit = this.settings_list[this.current_slide_num].units;
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

            let buttonts = `
                  <button id="C" data-unit="metric" class="${metric}">&#176C</button>
                  <button id="F" data-unit="imperial" class="${imperial}">&#176F</button>`;

            this.active_slide.find('.buttons').html(buttonts);
            this.active_slide.find('.temp').html(temp);
            this.active_slide.find('.temp').each(function () {

                $(this).prop('counter', 0).animate({
                    counter: $(this).text()
                }, {
                    duration: 500,
                    easing: 'swing',
                    step: function (now) {
                        $(this).html(Math.ceil(now) + '&#176');
                    }
                });

            });
        },

        renderSlider(){

            let slider = $(this.element).find('.slider');
            let pagination = $(this.element).find(".slider-pagi");
            let numOfSlides = slider.children().length - 1;
            let elementWidth = $(this.element).find('.slide').width();
            let curSlide = 0;
            let animating = false;
            let diff = 0;

            function createBullets() {
                pagination.html('');
                for (let i = 0; i < numOfSlides + 1; i++) {
                    let li = $("<li class='slider-pagi__elem'></li>");
                    li.addClass("slider-pagi__elem-" + i).attr("data-page", i);
                    if (!i) li.addClass("active");
                    pagination.append(li);
                }
            }

            createBullets();

            function changeSlides() {
                debugger;
                animating = true;
                slider.addClass("animating");
                slider.attr('data-active', curSlide);
                $(".slide").removeClass("active");
                $(`.weather_${curSlide}`).addClass("active");
                $(".slider-pagi__elem").removeClass("active");
                $(".slider-pagi__elem-" + curSlide).addClass("active");
                slider.css("transform", "translateX(" + -curSlide * elementWidth + "px)");
                diff = 0;
            }

            $(this.element).on("click", ".slider-pagi__elem", this, function (event) {
                curSlide = $(this).data("page");
                let _that = event.data;
                _that.current_slide_num = curSlide;

                debugger;
                changeSlides();
                if (_that.active_slide && _that.active_slide.find('.location').attr('data-ci') !== _that.settings_list[_that.current_slide_num].city_id) {
                    _that.updateWidget();
                }
            });

            $(`.slider-pagi__elem-${numOfSlides}`).trigger("click")
        },

        renderDay(){
            let time = this.weather_data.time;
            let hours = moment(time).hours();
            let dayClass = '';

            let sun_angle = (hours - 9) * 30;
            //console.log(sun_angle);

            let dayElements = [
                $(this.element),
                this.active_slide.find('.circle-day'),
                this.active_slide.find('.bg-wrap'),
                this.active_slide.find('.visual')
            ];

            console.log(this.active_slide);

            let dayList = [
                'early_morning',
                'late_morning',
                'early_day',
                'late_day',
                'early_evening',
                'late_evening',
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


            console.log(dayClass);
            this.active_slide.find('.sun').find('animateTransform')
                .attr('from', `${sun_angle - 60} 50 100`)
                .attr('to', `${sun_angle} 50 100`);

            dayElements.forEach((el)=> {
                dayList.forEach((day)=> {
                    el.removeClass(day);
                });
                el.addClass(dayClass);
            });

        },

        renderClock(time){

            this.active_slide.find('.clock').attr('data-time', time.time);
            //render
            let hands = [
                {
                    hand: 'hours',
                    angle: (time.hours * 30) + (time.minutes / 2)
                },
                {
                    hand: 'minutes',
                    angle: (time.minutes * 6)
                }
            ];

            hands.forEach((elem)=> {
                $('.clock').find('.' + elem.hand).css(
                    {
                        transform: 'rotateZ(' + elem.angle + 'deg)'
                    }
                )
            })
        },

        registerEvents () {

            $(this.element).on('submit', '.search-form', this, function (event) {
                debugger;
                let _this = event.data;
                let elem = $(event.target);
                let city = $.trim($(this).find('input').val());
                event.preventDefault();


                if(!city)return;

                if (elem.closest('.slide').hasClass('pin')) {
                    //new element
                    _this.settings_list.push(Object.assign({}, defaults));
                    _this.current_slide_num =  _this.settings_list.length-1;

                    //_this.setSettings(defaults);
                    _this.setSettings({city: city});
                    _this.renderSlides(1);
                } else {
                    _this.setSettings({city: city});
                }
                _this.updateWidget();
            });

            $(this.element).on('click', 'button', this, function (event) {
                let _this = event.data;
                let unit = $(event.target).data('unit');
                _this.setSettings({units: unit});
                _this.renderUnits(_this.weather_data);
            });

            //setting data to local storage
            $(this.element).on("change", "#remember:checkbox", this, function (event) {
                let _this = event.data;
                let elem = $(event.target);
                if ($(event.target).is(':checked')) {
                    elem.closest('.slide').addClass('pin');
                    _this.setSettings({'remember': true});
                    _this.setToLocalStorage(_this.settings_list[_this.current_slide_num]);
                } else {
                    elem.closest('.slide').removeClass('pin');
                    _this.setSettings({'remember': false});
                    let id = _this.weather_data.city_id;
                    _this.clearLocalStorage(id);
                }
            });

            $(this.element).on("click", ".rounded-btn", (event)=> {
                event.preventDefault();
                $(this.element).find('.slide.active').find('.search-holder').slideToggle(1200);
            });

            $(this.element).on("click", ".arrow", ()=> {
                $(this).toggleClass("open");
                $(this.element).find('.slide.active').find('.remember').animate({
                    height: 'toggle'
                });
            });
        },

        setToLocalStorage(data){

            if (typeof(Storage) === "undefined")return;

            let a = JSON.parse(localStorage.getItem(this.storage)) || [];

            debugger;
            //Prevent from pushing the same data
            let isNew = a.every((el)=> {
                return el.city_id !== data.city_id
            });
            if (!isNew)return;
            a.push(data);
            localStorage.clear(this.storage);
            localStorage.setItem(this.storage, JSON.stringify(a));
            console.log(a)
        },

        clearLocalStorage(id){
            let a = JSON.parse(localStorage.getItem(this.storage));
            a = a.filter((el)=> {
                return el.city_id != id;
            });
            localStorage.clear(this.storage);
            localStorage.setItem(this.storage, JSON.stringify(a));
            console.log(localStorage.getItem(this.storage));
        },

        countStorageElements(){
            let a = JSON.parse(localStorage.getItem(this.storage));
            return a.length;
        },

        setSettings(data)  {
            return Object.assign(this.settings_list[this.current_slide_num], data);
        },

        //sets global location data from api
        setSettingsByDefault(){
            return new Promise((resolve, reject)=> {
                this.getLocation().then((data)=> {
                    let globalData = {
                        city: data.city,
                        timezone: data.timezone
                    };


                    let settings = this.settings_list[0];
                    //To Prevent from setting empty value
                    for (var key in settings) {
                        if (settings.hasOwnProperty(key)) {
                            if (!settings[key]) {
                                settings[key] = globalData[key];
                            }
                        }
                    }
                    resolve(this.settings);
                });
            })
        },

        setSettingFromStorage(){
            if (!localStorage.getItem(this.storage))return false;
            console.log('from storage');
            debugger;
            this.settings_list = JSON.parse(localStorage.getItem(this.storage));
            this.settings = this.settings_list[0];
            return true;
        },

        getLocation(){
            return new Promise((resolve, reject) => {
                $.getJSON("http://ip-api.com/json")
                    .done(function (data) {
                        resolve(data);
                    });
            });
        },

        //additional features
        addAutocomplete(){

            /*  let inp = $(this.element).find('input.city');

             $.fn.geocomplete(inp);
             inp.geocomplete();


             if($.fn.geocomplete) {
             inp.geocomplete({
             details: ".geo-details",
             detailsAttribute: "data-geo"
             })
             .bind("geocode:result",function (e) {
             $(this).val($(this).text()).trigger("geocode");
             //$(this).trigger('submit')
             })}
             */

        }
    });


    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
