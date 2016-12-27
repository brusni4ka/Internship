/**
 * Created by kate on 27/12/16.
 */
import {STORAGE_ITEM} from '../constants/LocalStorageConfig'

export const setToStorage = (item)=>{
    localStorage.clear(STORAGE_ITEM);
    localStorage.setItem(STORAGE_ITEM, JSON.stringify(item));
};
export const cleanStorage =()=>{
    localStorage.clear(STORAGE_ITEM);
};
 