/**
 * Created by kate on 10/11/16.
 */
export default class Dispatcher {

    constructor() {
        this.callbacks = [];
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
