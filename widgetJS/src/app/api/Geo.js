"use strict";
import Config from '../config';

export  default class Geo {

    constructor() {
        this._available = true;
        this._params = {
            lat: '',
            lng: '',
            city: '',
            state: '',
            message: ''
        };
        if (!navigator.geolocation) {
            this._available = false;
            this._params.message = 'Geolocation is not supported by your browser';
        }
        return this;
    }

    init() {
        if (!this._available) {
            return;
        }

    }

    _error(msg) {
        this._params.message = msg;
    }

    _success(position) {
        return Promise.resolve(position.coords);
    }

    _getCurrentLocation() {
        return navigator.geolocation.getCurrentPosition(this._success, this._error)
    }

    getLocation(city) {

        if (!city) {
            let promise = new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            return promise.then((position) => {
                return {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            }).catch((err) => {
                console.error(err.message);
            });
        }
        return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${Config.GEO_API_KEY}`)
            .then(data=>data.json())
            .then(data=> {
                return Promise.resolve(data.results[0].geometry.location);
            });
    }

    _codeLatLng(latlng) {
        let geocoder = new google.maps.Geocoder();
        /*     let city = 'Pseudo';
         let state;
         let message;*/
        let result = {city: '', state: '', message: ''};
        geocoder.geocode({'latLng': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    for (let i = 0; i < results.length; i++) {
                        switch (results[i].types[0]) {
                            case 'locality':
                                result.city = results[i].address_components[0].short_name;
                                result.state = results[i].address_components[2].short_name;
                                break;
                            case 'country':

                                result.state = results[i].address_components[0].short_name !== 'US' ?
                                    results[i].address_components[0].short_name : state;
                                break;
                        }
                    }
                } else {
                    //message =  'No reverse geocode results.';
                }
            } else {
                //message = 'Geocoder failed:' + status;
            }
        });

        return result.city;
    }

    getGeoData() {
        return this._params;
    }

}
   