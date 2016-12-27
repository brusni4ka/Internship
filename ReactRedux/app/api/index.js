/**
 * Created by kate on 27/12/16.
 */
import {STORAGE_NAME} from '../constants/LocalStorageConfig'
const LocalStorage = (function () {

    const setToStorage = (item)=>{
        localStorage.clear(STORAGE_NAME);
        localStorage.setItem(STORAGE_NAME, JSON.stringify(item));
    };
    const cleanStorage =()=>{
        localStorage.clear(STORAGE_NAME);
    };

    return {
        setToStorage:setToStorage,
        cleanStorage:cleanStorage
    }

}());


export default LocalStorage;
