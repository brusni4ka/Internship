/**
 * Created by kate on 30/11/16.
 */
import View from '../Base/View';
export  default class Template extends View {
    
    state = {};
    
    render() {
        console.log('template render');
        const { done } = this.state;
        const node = View._node;
        debugger;

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
                      <!--search input go here-->
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
        if (done) {
            node.innerHTML = template ;
        }
    };

    shouldViewUpdate(data) {
        debugger;
        let isStateChanged = false;
        Object.keys(data).forEach(dataKey => {
            if (data[dataKey] !== this.state[dataKey]) {
                isStateChanged = true;
            }
        });
        return isStateChanged;
    };
}