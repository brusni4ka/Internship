import EventEmitter from '../EventEmitter/EventEmitter'
export default class Store extends EventEmitter {
    constructor() {
        super();
        this._store = {};
        this._storeName = name || this.constructor.name;
    }
    
    setWeatherData(data){
 /*     if(!this._store.weatherData){
          this._store.weatherData={};
          Object.assign(this._store.weatherData, {
              city_id: '',
              city: '',
              state: '',
              units: '',
              descr: '',
              temp: '',
              tempF: '',
              speed: '',
              pressure: '',
              humidity: '',
              img_url: '',
              time: ''
          });
      }
        */
        Object.assign(this._store, data);
    };
    
    
    
    getState() {
        return this._store;
    }
}
