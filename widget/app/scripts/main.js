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
    weatherkey: 'd934a70081a5cef84dd9dcbf3c0412ed',
    gtimezonekey: 'AIzaSyBqO6Eblf3EeVW59nndnsXOjrdYtrFrIFU'
  };

  var defaults = {
    cityId:'',
    city: '',
    units: 'metric',
    remember: '',
    timezone: ''
  };

  var timeOut = {widgetId: '', clockId: '', time: ''};

  // The actual plugin constructor
  function Plugin(element, options) {

    this.name = pluginName;
    //root element
    this.element = element;
    this.activeSlide = '';

    //Dynamic settings
    this.settings = Object.assign($.extend({}, defaults, options));

    //Contains a list of setting;
    this.settings_list = [Object.assign({}, this.settings)];
    this.settings_list[0] = this.settings;

    //Local Storage key
    this.storage = 'weatherWidget';

    //Dynamic data for rendering
    this.weatherData = {
      cityId: '',
      city: '',
      state: '',
      units: '',
      descr: '',
      temp: '',
      tempF: '',
      speed: '',
      pressure: '',
      humidity: '',
      imgUrl: '',
      time: ''
    };
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {

    init: function () {
      console.log(this.settings);
      //If we have data in storage, we initialize widget with that data
      /*     if (!this.setSettingFromStorage()) {
       //We initialize widget with global data
       this.setSettingsByDefault()
       .then(()=>this.updateWidget());
       }*/

      this.setSettingsByDefault()
          .then(()=>{
        this.updateWidget()
    });
      this.registerEvents();
    },

    //combine function chane;
    runWidget(){

      this.getWeather()
          .then((response) => {
        Object.assign(this.settings, { cityId: response.weather.cityId});
      Object.assign(this.weatherData, response.weather);
      return this.getTimeZone(response.coord)
    })
    .then((zone)=> {
        let time = this.getTime(zone);
      Object.assign(this.settings, { timezone: zone});
      Object.assign(this.weatherData, {time: time});
    })
    .then(()=> {
        if (!this.isNewCityId(this.weatherData.cityId)) {
        return false;
      }
      //setting data only to the active widget
      //setting active slide
      // this.renderNewSlide();
      this.renderWidget(this.weatherData);
      this.renderUnits(this.weatherData);
      this.renderDay();
      this.updateTime();
      this.addAutocomplete();
      console.log("settings_list");
      console.log(this.settings_list);
    });
    },


    //check if it's new city
    isNewCityId(id){
      let fl = true;
      $(this.element).find('.location').each(function () {
        debugger;
        if ($(this).data("ci") == id) {
          fl = false;
        }
      });
      return fl;
    },

    updateWidget(){
      /* let i = parseInt($('.slider').attr('data-active')) || 0;
       this.temp_settings = this.settings[i];*/

      //update in an hour
      let delay = (60 - (new Date().getMinutes())) * 60000;
      this.runWidget();

      if (timeOut.widgetId) {
        clearTimeout(parseInt(timeOut.widgetId));
      }

      let id = setTimeout(()=> {
            this.updateWidget();
    }, delay);

      timeOut.widgetId = id;
      timeOut.time = delay;
      console.dir(timeOut);
    },

    getWeather () {
      //Getting the weather data from the open weather API
      let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${this.settings.city}&appid=${apiKeys.weatherkey}&units=metric`;
      console.log('1', weatherUrl);
      console.dir(this.settings);

      return new Promise((resolve, reject) => {
            $.getJSON(weatherUrl)
              .done(function (response) {
                resolve({
                  weather: {
                    cityId: response.id,
                    city: response.name,
                    state: response.sys.country,
                    descr: response.weather[0].description,
                    tempC: response.main.temp,
                    tempF: response.main.temp * 9 / 5 + 32,
                    humidity: response.main.humidity,
                    pressure: response.main.pressure,
                    speed: response.wind.speed,
                    imgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217538/' + response.weather[0].icon + '.png'
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
          `location=${geodatas.lat},${geodatas.lon}&timestamp=1331161200&key=${apiKeys.gtimezonekey}`;
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

      let time = this.weatherData.time;
      let delay = delayTime || (60000 - moment(time).seconds() * 60);

      console.log(delay);

      if (timeOut.clockId) {
        clearTimeout(parseInt(timeOut.clockId));
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


      this.weatherData.time = moment(time).add(1, 'minutes');
      timeOut.clockId = id;
      console.dir(delay);
    },

    renderNewSlide(){
      debugger;
      if (!this.activeSlide)return;
      if (this.activeSlide.hasClass('pin')) {
        let length = $(this.element).find('.slider').children().length;
        $(`<div class="slide weather_${length}">`).append($('.slide').html()).appendTo('.slider');
        this.activeSlide = $(`.slide.weather_${length}`);
        console.log(this.activeSlide);
      }
      console.log(length);
      this.renderSlider(length);
    },

    renderWidget (dataWeather) {
      //render from string
      console.log("renderWidget");
      console.log(dataWeather);
      console.log("Setting");
      console.log(this.settings);
      let ischecked = this.settings.remember ? 'checked' : '';
      let meteo_info = `<img class="weather-icon" src= "${dataWeather.imgUrl}" alt="icon">
              <div class="weather">
                <div class="descr">${dataWeather.descr}</div>
                <div class="temp"></div>
                <div class="other-inf">
                  <span class="humidity">${dataWeather.humidity}&#176;</span>
                  <span class="pressure">${dataWeather.pressure}&#176;</span>
   render             </div>
                <span class="wind">Winds: ${dataWeather.speed} MPH</span>
              </div>`;
      let template =
          `
       <div class="widget">
            <ul class="slider-pagi"></ul>
            <div class="slider" data-active="0">
              <div class="slide weather_0">
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
                      <input id="remember" type="checkbox" ${ischecked}>
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
              </div>  
            </div><!--end slider-->
          </div>
          `;

      if (!$(this.element).hasClass('done')) {
        $(this.element).html(template);
        $(this.element).addClass('done');
        $(this.element).find('.slide').addClass('active')
      }

      this.activeSlide = this.activeSlide || $('.slide.active');
      if(ischecked){
        this.activeSlide.addClass('pin');
      }
      debugger;
      console.log(this.activeSlide);
      this.activeSlide.find('.location')
          .html(`${dataWeather.city}, ${dataWeather.state}`)
          .attr("data-ci", dataWeather.cityId);

      this.activeSlide.find('.meteo-info').html(meteo_info);
    },

    renderUnits(dataWeather){
      this.activeSlide = $('.slide.active');
      console.log(this.activeSlide, 'renderUnits');
      let activeUnit = this.settings.units;
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

      this.activeSlide.find('.buttons').html(buttonts);
      this.activeSlide.find('.temp').html(temp);
      this.activeSlide.find('.temp').each(function () {

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
        debugger;
        if(_that.settings_list[curSlide]){
          if(!_that.settings_list[numOfSlides]){
            _that.settings_list.push(Object.assign({},_that.settings));
            console.log(_that.settings_list);
          }
          // if we already have this element in remember state, make a link on it's settings
          _that.settings = _that.settings_list[curSlide];
          console.log(_that.settings_list[curSlide]);
        }

        changeSlides();
      });

      $(`.slider-pagi__elem-${numOfSlides}`).trigger("click")
    },

    renderDay(){
      let time = this.weatherData.time;
      let hours = moment(time).hours();
      let dayClass = '';

      let sun_angle = (hours - 9) * 30;
      //console.log(sun_angle);

      let dayElements = [
        $(this.element),
        this.activeSlide.find('.circle-day'),
        this.activeSlide.find('.bg-wrap'),
        this.activeSlide.find('.visual')
      ];

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

      this.activeSlide.find('.sun').find('animateTransform')
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

      this.activeSlide.find('.clock').attr('data-time', time.time);
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

        let _this = event.data;
        let elem = $(event.target);
        let city = $(this).find('input').val();
        event.preventDefault();

        debugger;

        if(elem.closest('.slide').hasClass('pin')){

          //new element
          _this.settings_list.push(Object.assign( {}, defaults));
          _this.settings = _this.settings_list[_this.settings_list.length-1];
          _this.setSettings(defaults);

        }
        //new setting element

        _this.setSettings({city: city});

        _this.renderNewSlide();
        //Render new slide If current has remember(pin) state
        _this.updateWidget();
      });

      $(this.element).on('click', 'button', this, function (event) {
        let _this = event.data;
        let unit = $(event.target).data('unit');
        _this.setSettings({units: unit});
        _this.renderUnits(_this.weatherData);
      });

      //setting data to local storage
      $(this.element).on("change", "#remember:checkbox", this, function (event) {
        let _this = event.data;
        let elem = $(event.target);
        if ($(event.target).is(':checked')) {
          elem.closest('.slide').addClass('pin');
          _this.setSettings({'remember': true});
          //  _this.setToLocalStorage( _this.settings);
        } else {
          elem.closest('.slide').removeClass('pin');
          _this.setSettings({'remember': false});
          let id = _this.weatherData.cityId;
          //_this.clearLocalStorage(id);
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
      console.log(localStorage);

      let a = JSON.parse(localStorage.getItem(this.storage)) || [];
      debugger;
      /*  /!*  let isNew = a.some((el)=>{
       return  Object.keys(el)[0] == key
       });*!/
       if(!isNew)return;*/
      a.push(data);
      localStorage.clear(this.storage);
      localStorage.setItem(this.storage, JSON.stringify(a));
      console.log(a)
    },

    clearLocalStorage(id){
      debugger;
      let a = JSON.parse(localStorage.getItem(this.storage));
      a = a.filter((el)=> {
            return el.cityId!=id;
    });
      localStorage.clear(this.storage);
      localStorage.setItem(this.storage, JSON.stringify(a));
      console.log(localStorage.getItem(this.storage));
    },

    setSettings(data)  {
      debugger;
      // let i =  parseInt($(this.element).find('.slide').attr('data-active'));

      return Object.assign(this.settings, data);
    },

    //sets global location data from api
    setSettingsByDefault(){
      return new Promise((resolve, reject)=> {
            this.getLocation().then((data)=> {
            let globalData = {
              city: data.city,
              timezone: data.timezone
            };

      //To Prevent from setting empty value
      for (var key in this.settings) {
        if (this.settings.hasOwnProperty(key)) {
          if (!this.settings[key]) {
            this.settings[key] = globalData[key];
          }
        }
      }
      resolve(this.settings);
    });
    })
    },

    setSettingFromStorage(){
      debugger;
      let _that = this;
      if (!localStorage.getItem(this.storage))return false;
      console.log('from storage');

      let settings = JSON.parse(localStorage.getItem(this.storage));
      console.dir(settings);
      for (let i = 0, l = settings.length; i < l; i++) {
        _that.setSettings(settings[i]);
        _that.updateWidget();
      }
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
      let autocomplete = new google.maps.places.Autocomplete(
          document.getElementsByClassName('city')[0], {
            types: ['(cities)']
          });
      //autocomplete.addListener('place_changed', () => {});
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
