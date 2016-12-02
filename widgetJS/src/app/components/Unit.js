/**
 * Created by kate on 30/11/16.
 */
import View from '../Base/View';
import WidgetActions from '../actions/actions'
export  default class Unit extends View {

    state = {};
    
    render() {
        console.log('render unit');
        console.dir(this.state);
        const {
            tempC,
            tempF,
            unit
        } =  this.state;
        const node = View._node;

        let metric;
        let imperial;
        let currentTemp;
        const buttonsNode = node.getElementsByClassName('buttons')[0];
        const temperatureNode = node.getElementsByClassName('temp')[0];

        if ('metric' === unit) {
            metric = 'active';
            imperial = '';
            currentTemp = tempC;
        } else {
            metric = '';
            imperial = 'active';
            currentTemp = tempF;
        }

        buttonsNode.addEventListener('click', WidgetActions.changeUnit.bind(this));

        let buttons = `
                  <button class='unit-btn ${metric}' id="C" data-unit="metric">&#176C</button>
                  <button class='unit-btn ${imperial}' id="F" data-unit="imperial">&#176F</button>`;

        buttonsNode.innerHTML = buttons;
        temperatureNode.innerHTML = Math.ceil(currentTemp) + '&#176';
    };


    mapDataToState( {temp} ) {
        return temp;
    };


    shouldViewUpdate(data) {
        let isStateChanged = false;
        Object.keys(data).forEach(dataKey => {
            if (data[dataKey] !== this.state[dataKey]) {
                isStateChanged = true;
            }
        });
        return isStateChanged;
    };




}