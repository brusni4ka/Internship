/**
 * Created by kate on 01/12/16.
 */
import View from '../Base/View';
import WidgetActions from '../actions/actions'
export default class SearchInput extends View {

    state = {};

    render() {
        this.node = View._node;
        let formHolder =   this.node.getElementsByClassName('search-form')[0];
        let searchForm = `<div class="div">
                          <label for="city">Weather in ...</label>
                          <div class="input-holder">
                            <input class="city" type="text" placeholder="">
                            <a type="submit" class="search-btn fa fa-search" aria-hidden="true"></a>
                          </div>
                        </div>`;

        formHolder.innerHTML = searchForm;
        formHolder.addEventListener('submit', WidgetActions.exploreWeatherInCity.bind(this))
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