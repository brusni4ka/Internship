/**
 * Created by kate on 29/11/16.
 */
export  default class View {

    state = {};

    render() {
    };

    mapDataToState() {
    };

    shouldViewUpdate() {
    };

    setState(data) {
        const mappedData = this.mapDataToState ? this.mapDataToState(data) : data;
        const shouldUpdate = this.shouldViewUpdate ? this.shouldViewUpdate(mappedData) : true;

        if (shouldUpdate) {
            this.state = Object.assign({}, this.state, mappedData);
            this.render();
        }
    }
}