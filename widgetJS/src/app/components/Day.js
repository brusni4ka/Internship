/**
 * Created by kate on 30/11/16.
 */
import View from '../Base/View';
export  default class Day extends View {

    state = {};

    render() {
        const { time } = this.state;
        const node = View._node;

        let hours = moment(time).hours();
        let dayClass = '';
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

    };

    mapDataToState({time }) {
        return { time }
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