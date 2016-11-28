/**
 * Created by kate on 28/11/16.
 */
export default class ViewWeather{
    
    constructor(node){
      this._node = node;
    };
    
    setNode(el){

        this._node = el;
    }
    
    render(dataWeather){

        let meteoNode =  document.getElementsByClassName('meteo-info')[0];
        let location =  document.getElementsByClassName('location')[0];
        let meteoInfo = `<img class="weather-icon" src= "${dataWeather.img_url}" alt="icon">
              <div class="weather">
                <div class="descr">${dataWeather.descr}</div>
                <div class="temp">${dataWeather.tempC}</div>
                <div class="other-inf">
                  <span class="humidity">${dataWeather.humidity}&#176;</span>
                  <span class="pressure">${dataWeather.pressure}&#176;</span>
                </div>
                <span class="wind">Winds: ${dataWeather.speed} MPH</span>
              </div>`;

        meteoNode.innerHTML = meteoInfo;
        location.innerText = `${dataWeather.city}, ${dataWeather.state}`;
        location.setAttribute("data-ci", dataWeather.city_id);

    }

    renderTemplate(){

        let template =
            `
       <div class="widget">
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
        if (! this._node.classList.contains('done')) {
            this._node.innerHTML = template ;
            this._node.classList.add('done');
        }
    }

    renderDay (dataWeather) {

        let time = dataWeather.time;
        let hours = moment(time).hours();
        let dayClass = '';
        let node =  this._node;

        let sun_angle = (hours - 9) * 30;

        let dayElements = [
            node,
            node.getElementsByClassName('circle-day')[0],
            node.getElementsByClassName('bg-wrap')[0],
            node.getElementsByClassName('visual')[0]
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

        debugger;

        let sun = node.getElementsByClassName('sun')[0]
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

    renderClock(dataWeather){
        this._node.getElementsByClassName('clock')[0].setAttribute('data-time', dataWeather.time);

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
    }

    renderSlides (count) {
        let length =  this._node.find('.slider').children().length || 0;
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
    }

}