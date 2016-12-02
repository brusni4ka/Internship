/**
 * Created by kate on 29/11/16.
 */
export  default class View {
    
    //node DOM element 
    _node = null;

    state = {};

    render() {
    };

    /*mapDataToState() {
    };

    shouldViewUpdate() {
    };*/

    setState(data) {

        const mappedData = this.mapDataToState ? this.mapDataToState(data) : data;
        const shouldUpdate = this.shouldViewUpdate ? this.shouldViewUpdate(mappedData) : true;

        if (shouldUpdate) {
            let state = this.state;
            //To Prevent from setting empty value
            for (var key in mappedData) {
                if (mappedData.hasOwnProperty(key)) {
                    if (mappedData[key]) {
                        state[key] = mappedData[key];
                    }
                }
            }
            this.render();
        }
    }

    
    static setNode(node) {
        this._node = node;
    }
}