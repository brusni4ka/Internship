/**
 * Created by kate on 10/11/16.
 */
export default class Dispatcher {

    constructor() {
        if (!Dispatcher.instance) {
            this.callbacks = [];
            Dispatcher.instance = this;
        }
        return Dispatcher.instance;
    }

    register(callback) {
        this.callbacks.push(callback);
    }

    dispatch(payload) {
        this.callbacks.forEach(function (el) {
            el(payload);
        });
    }
}
