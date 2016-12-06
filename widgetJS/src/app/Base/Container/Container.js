/**
 * Created by kate on 29/11/16.
 */
import ViewWeather from '../components/ViewWeather';
import View from '../View';
import Weather from '../components/Weather';


export default class Container extends View{

    constructor(node){
        super();
        this._node = node;
    }
    
    render(){
        Weather.setState({...this.state, node: this._node });
    };
    
}