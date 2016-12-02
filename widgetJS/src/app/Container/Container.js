/**
 * Created by kate on 29/11/16.
 */
import View from '../Base/View';
import {Weather, Template, Day, Clock, Unit, SearchInput} from '../components'

export default class Container extends View {

    constructor(node) {
        super();
        View.setNode(node);
        Object.assign(this,
            {
                template: new Template(),
                weather: new Weather(),
                day: new Day(),
                clock: new Clock(),
                unit: new Unit(),
                searchInput: new SearchInput()
            })
    }

    render(data) {
        
        this.template.setState({done: true});
        this.searchInput.setState({done: true});
        
        this.weather.setState({...data});
        this.day.setState({...data});
        this.clock.setState({...data});
        this.unit.setState({...data});
    }



    /*    setNode(node) {
     let data = this.state;
     this._node = node;
     this.render(data);
     }*/
}