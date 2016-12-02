/**
 * Created by kate on 30/11/16.
 */
import View from '../Base/View';
export  default class Clock extends View {

    state = {};

    render() {
        const { time } = this.state;
        const node = View._node;
        
        let timeHolder = {
            time: moment(time).format("hh:mm a ").toUpperCase(),
            hours: moment(time).hour(),
            minutes: moment(time).minutes()
        };
      
        let clock =  node.getElementsByClassName('clock')[0];
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

        this.tick();
    };

    mapDataToState({time}) {
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

    tick(){
        const { time } = this.state;
        if(this.tick_id ){
            clearInterval(parseInt(this.tick_id));
        }
        this.tick_id = setInterval(()=> {
            this.setState({
                time: moment(time).add(1, 'minutes')
            });
        }, 60000);
    }

    startClock(){
        const { time } = this.state;
        if( this.clock_id )return;
        if( this.tick_id ){
            clearInterval(parseInt(this.tick_id));
        }
        let delay = (60000 - moment(time).seconds() * 60);
        this.clock_id = setTimeout(()=> {
            this.tick();
        }, delay);
    }
}