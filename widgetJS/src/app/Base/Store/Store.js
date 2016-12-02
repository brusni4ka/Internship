import EventEmitter from '../EventEmitter'
export default class Store extends EventEmitter {
    constructor() {
        super();
        this._store = {};
        this._storeName = name || this.constructor.name;
    }

    setData(data, storeEl) {
        Object.assign(this._store, data);
     /*   let store = storeEl || this._store;
        if (typeof data !== 'object') {
            return;
        }
        if (Object.keys(store).length == 0) {
            Object.assign(store, data);
            return;
        }
        Object.keys(data).forEach(key => {
            if (store.hasOwnProperty(key)) {
                if (typeof data[key] == 'object') {
                    return this.setData(data[key], store[key]);
                }
                store[key] = data[key];
            }
        });
        return;*/
    };


    getState() {
        return Object.assign({},this._store);
    }

}
