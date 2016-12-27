/**
 * Created by kate on 27/12/16.
 */
export const isValidEmail = (email)=> {
    return /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/igm.test(email);
};