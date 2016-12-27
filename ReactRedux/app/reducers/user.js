/**
 * Created by kate on 26/12/16.
 */
import {
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS
} from '../constants/ActionTypes'

const user = (state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('id_token') ? true : false
}, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state, ...{
                    isFetching: true,
                    isAuthenticated: false,
                    user: action.creds
                }
            };
            break;
        case LOGIN_SUCCESS:
            return {
                ...state, ...{
                    isFetching: false,
                    isAuthenticated: true,
                    errorMessage: ''
                }
            };
            break;

        case LOGIN_FAILURE:
            return {
                ...state, ...{
                    isFetching: false,
                    isAuthenticated: false,
                    errorMessage: action.message
                }
            };
            break;

        case LOGOUT_SUCCESS:
            return {
                ...state, ...{
                    isFetching: false,
                    isAuthenticated: false
                }
            };
            break;

        default:
            return state
    }

};


export  default user;