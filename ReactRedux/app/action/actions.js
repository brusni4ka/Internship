import {
    DELETE_STUDENT,
    SAVE_STUDENT,
    EDIT_STUDENT,
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS
} from '../constants/ActionTypes'
import {isValidEmail} from '../helpers';
import LocalStorage from '../api';


export const remove = (id) => ({
    type: DELETE_STUDENT,
    id
});

export const save = (payload)=> ({
    type: SAVE_STUDENT,
    data: payload
});

export const edit = (payload)=> ({
    type: EDIT_STUDENT,
    data: payload
});


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

export const loginUser = (creds)=> {

    return dispatch => {
        dispatch(requestLogin(creds));
        
        if(!isValidEmail(creds.username)){
            dispatch(loginError('Your email is unvalid. Please, try one more time!'));
            return;
        }
        
        let id_token = Object.values(creds).every(el=>el)? btoa(Object.values(creds).join('')):'';

        if (id_token == '') {
            // Dispatch the error action
            dispatch(loginError('Please try one more time'));
            return;
        }
        setTimeout(() => {
            LocalStorage.setToStorage(id_token);
            // Dispatch the success action
            dispatch(receiveLogin(id_token));
        }, 2000)
    }
};

export const logoutUser = ()=>{
    return dispatch=>{
        LocalStorage.cleanStorage();
        dispatch(requestLogout());
    }
};



 