import {
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS
} from '../constants/ActionTypes'
import {isValidEmail} from '../helpers';
import * as LocalStorage from '../api';


const requestLogin = (creds)=> ({
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
});

const receiveLogin = (token)=>({
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: token
});

const loginError = (message)=> (
{
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
});

const requestLogout = ()=> ({
    type: LOGOUT_SUCCESS
});

export const loginUser = (creds)=> dispatch => {
    dispatch(requestLogin(creds));

    if (!isValidEmail(creds.username)) {
        return dispatch(loginError('Your email is invalid. Please, try one more time!'));
    }

    const id_token = Object.values(creds).every(el=>el) ? btoa(Object.values(creds).join('')) : null;

    if (id_token === null) {
        // Dispatch the error action
        return dispatch(loginError('Please try one more time'));
    }
    setTimeout(() => {
        LocalStorage.setToStorage(id_token);
        // Dispatch the success action
        dispatch(receiveLogin(id_token));
    }, 2000)
};

export const logoutUser = () => dispatch=> {
    LocalStorage.cleanStorage();
    dispatch(requestLogout());
};



 