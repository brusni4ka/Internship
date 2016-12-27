/**
 * Created by kate on 26/12/16.
 */
function setToLocalStorage(data) {

    if (typeof(Storage) === "undefined")return;

    let a = JSON.parse(localStorage.getItem(storage)) || [];

    //Prevent from pushing the same data
    let isNew = a.every((el)=> {
        return el.city_id !== data.city_id
    });
    if (!isNew)return;
    a.push(data);
    localStorage.clear(storage);
    localStorage.setItem(storage, JSON.stringify(a));
}



function clearLocalStorage(id) {
    let a = JSON.parse(localStorage.getItem(storage));
    a = a.filter((el)=> {
        return el.city_id != id;
    });
    localStorage.clear(storage);
    if (a.length > 0) {
        localStorage.setItem(storage, JSON.stringify(a));
    }
}


export * as storage;