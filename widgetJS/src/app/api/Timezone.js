/**
 * Created by kate on 28/11/16.
 */
export default class TimeZone{
    constructor(){
        this._apiKey = 'AIzaSyBqO6Eblf3EeVW59nndnsXOjrdYtrFrIFU'
    }

    getTimeZone (geodatas) {
        

        let timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?` +
            `location=${geodatas.lat},${geodatas.lng}&timestamp=1331161200&key=${this._apiKey}`;
        
        return fetch(timezoneUrl)
            .then(data=>data.json())
            .then(data=>{
                return Promise.resolve( {
                    timeZoneId : data.timeZoneId
                })
            });
    }
}