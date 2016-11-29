import EventEmitter from '../EventEmitter/EventEmitter'
export default class Store extends EventEmitter {
    constructor() {
        super();
        this._store = {};
        this._storeName = name || this.constructor.name;
    }
    
    setWeatherData(data){
        Object.assign(this._store, data);
    };
    
    getState() {
        return this._store;
    }
    
}
