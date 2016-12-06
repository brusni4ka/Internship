/**
 * Created by kate on 01/12/16.
 */
import Dispatcher from '../Base/Dispatcher';

export default {

    //Get new city's weather 
    exploreWeatherInCity: function (e) {
        e.preventDefault();
        let city = this.node.getElementsByClassName('city')[0].value.split(',').shift();
        if (!city)return;
        
        /**IS IT OK??? AM I NORMAL??**/
        (new Dispatcher).dispatch({
            type: 'GET_WEATHER_BY_CITY',
            params: city

        });
    },


    //Change the unit
    changeUnit: function (e) {
        debugger;
        if (e.target.classList.contains('unit-btn')) {
            let unit = e.target.getAttribute('data-unit');
            this.setState({
                temp: {unit: unit}
            });
        }
    }


    /* //
     arrowToggle: ()=> {
     let rememberBlock = node.getElementsByClassName('remember')[0];
     anim.slideToggle(rememberBlock);
     }*/


}