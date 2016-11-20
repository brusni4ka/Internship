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


  // Create the defaults once
  var pluginName = "WeatheWidget";
  //optional data that set automaticly via first initialisation
  var defaults = {
    city: '',
    units: '',
    apikey: 'd934a70081a5cef84dd9dcbf3c0412ed',
    gtimezonekey: 'AIzaSyBqO6Eblf3EeVW59nndnsXOjrdYtrFrIFU',
    remember: '',
    timezone: ''
  };

  var timeOut = {widgetId: '', clockId: '', time: ''};


  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._name = pluginName;
    //key
    this.storage = 'weatheWidget';
    this.weatherData = {
      city: '',
      state: '',
      units: '',
      descr: '',
      temp: '',
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

      //If we have data in storage, we initialize widget with that data
      if (this.setSettingFromStorage()) {
        this.updateWidget();
      } else {
        //We initialize widget with global data
        this.setSettingsByDefault()
            .then(()=>this.updateWidget());
      }
      this.registerEvents();
    },


    //combine function chane;
    runWidget(){
      console.log('in run');
      this.getWeather()
          .then((response) => {
        this.setData(this.weatherData, response.weather);
      return this.getTimeZone(response.coord)
    })
    .then((zone)=> {
        let time = this.getTime(zone);
      this.setData(this.weatherData, {time: time});
    })
    .then(()=> {
        this.renderWidget(this.weatherData);
      this.renderDay();
      this.updateTime();
      this.addAutocomplete();
    });
    },

    updateWidget(){
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
      let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${this.settings.city}&appid=${this.settings.apikey}&units=${this.settings.units}`;
      console.log('1', weatherUrl);
      let promise = $.Deferred();
      $.ajax(weatherUrl, {
        success(response){
          promise.resolve({
            weather: {
              city: response.name,
              state: response.sys.country,
              descr: response.weather[0].description,
              temp: response.main.temp,
              humidity: response.main.humidity,
              pressure: response.main.pressure,
              speed: response.wind.speed,
              imgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/217538/' + response.weather[0].icon + '.png',
            },
            coord: {
              lat: response.coord.lat,
              lon: response.coord.lon
            }
          });
        }
      });
      return promise;
    },

    getTime(zone){
      console.log(3, 'getTime');
      console.log(zone);
      return moment().tz(zone);

    },


    getTimeZone(geodatas){
      let timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?` +
          `location=${geodatas.lat},${geodatas.lon}&timestamp=1331161200&key=${this.settings.gtimezonekey}`;
      console.log('2', timezoneUrl);
      let promise = $.Deferred();
      $.ajax(timezoneUrl, {
            success: (data)=> {
            console.log('2', data.timeZoneId);
      promise.resolve(data.timeZoneId);
    }
    });
      return promise;
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

    renderWidget (dataWeather) {//render from string
      console.dir(4, 'renderWidget', dataWeather);
      let ischecked = this.settings.remember ? 'checked' : '';
      let activeUnit = this.settings.units;
      let metric = 'metric' === activeUnit ? 'active' : '';
      let imperial = 'imperial' === activeUnit ? 'active' : '';
      let buttonts = `
                  <button id="C" data-unit="metric" class="${metric}">&#176C</button>
                  <button id="F" data-unit="imperial" class="${imperial}">&#176F</button>`;

      let meteo_info = `<img class="weather-icon" src= "${dataWeather.imgUrl}" alt="icon">
              <div class="weather">
                <div class="descr">${dataWeather.descr}</div>
                <div class="temp">${dataWeather.temp}</div>
                <div class="other-inf">
                  <span class="humidity">${dataWeather.humidity}&#176;</span>
                  <span class="pressure">${dataWeather.pressure}&#176;</span>
                </div>
                <span class="wind">Winds: ${dataWeather.speed} MPH</span>
              </div>`;
      let template =
          `
          <div class="widget">
            <div class="visual">
              <div class="bg-wrap">
                <div class="circle-day"></div>
              </div>
              <svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                <circle fill="#FFDB4D"  cx="0" cy="100%" r="12" >
                 
                  <animateTransform
                    attributeName="transform"
                    dur="5s"
                    type="rotate"
                    from="0 50 70"
                    to="180 50 72"
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
                      <input id="city" type="text" placeholder="">
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
          `;

      if (!$(this.element).hasClass('done')) {
        $(this.element).html(template);
        $(this.element).addClass('done');
      }

      $(this.element).find('.location').html(`${dataWeather.city}, ${dataWeather.state}`);
      $(this.element).find('.buttons').html(buttonts);
      $(this.element).find('.meteo-info').html(meteo_info);
      $(this.element).find('.temp').each(function () {

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


    renderDay(){
      let time = this.weatherData.time;
      let hours = moment(time).hours();
      let dayClass = '';

      console.log(hours);

      let dayElements = [
        $(this.element),
        $(this.element).find('.circle-day'),
        $(this.element).find('.bg-wrap'),
        $(this.element).find('.visual')

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


      console.log(dayClass);
      dayElements.forEach((el)=> {
        dayList.forEach((day)=> {
        el.removeClass(day);
    });
      el.addClass(dayClass);
    });

    },

    renderClock(time){
      $(this.element).find('.clock').attr('data-time', time.time);
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

      $(this.element).on('submit', '.search-form', (event)=> {
        let city = $('input').val();
      event.preventDefault();
      this.setSettings({city: city});
      this.updateWidget();
    });

      $(this.element).on('click', 'button', (el)=> {
        console.log("I'm here button");
      console.log(this);
      let unit = $(el.target).data('unit');
      this.setSettings({units: unit});
      this.updateWidget();
    });
      //setting data to local storage
      $(this.element).on("change", "#remember:checkbox", ()=> {
        if ($("#remember").is(':checked')) {
        this.setSettings({'remember': true});
        this.setToLocalStorage(this.settings);
        return;
      }
      this.setSettings({'remember': false});
      this.clearLocalStorage();
    });

      $(this.element).on("click", ".rounded-btn", (event)=> {
        $('.search-holder').slideToggle(1200);
    });


      //this.addAutocomplete();

    },

    setToLocalStorage(data){
      if (typeof(Storage) === "undefined")return;
      localStorage.setItem(this.storage, JSON.stringify(data));
    },

    clearLocalStorage(){
      localStorage.removeItem(this.storage);
    },

    setData(template, data){
      return Object.assign(template, data);
    },

    setSettings(data)  {
      return Object.assign(this.settings, data);
    },

    //sets global data from api
    setSettingsByDefault(){
      return new Promise((resolve, reject)=> {
            this.getLocation().then((data)=> {
            let globalData = {
              city: data.city,
              units: 'metric',
              timezone: data.timezone
            };
      for (var key in this.settings) {
        if (this.settings.hasOwnProperty(key)) {
          if (!this.settings[key]) {
            this.settings[key] = globalData[key];
          }
        }
      }
      console.log('1', this.settings);
      resolve(this.settings);
    });
    })
    },

    setSettingFromStorage(){
      if (localStorage.getItem(this.storage)) {
        this.setSettings(JSON.parse(localStorage.getItem(this.storage)));
        return true;
      }
      return false;
    },

    /*   getWeatherUrl(data){//vtopku
     return `http://api.openweathermap.org/data/2.5/weather?q=${data.city}&appid=${data.apikey}&units=${data.units}`;
     },*/

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
          document.getElementById('city'), {
            types: ['(cities)'],
          });
      // autocomplete.addListener('place_changed', () => {});
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
