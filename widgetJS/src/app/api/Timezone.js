/**
 * Created by kate on 28/11/16.
 */
import Config from '../config';

export default class TimeZone{
    constructor(){
    }

    getTimeZone (geodatas) {
        

        let timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?` +
            `location=${geodatas.lat},${geodatas.lng}&timestamp=1331161200&key=${Config.TIMEZONE_API_KEY}`;
        
        return fetch(timezoneUrl)
            .then(data=>data.json())
            .then(data=>{
                return Promise.resolve( {
                    timeZoneId : data.timeZoneId
                })
            });
    }
}