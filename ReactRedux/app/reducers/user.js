/**
 * Created by kate on 26/12/16.
 */
import {
    LOGIN_REQUEST,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS
} from '../constants/ActionTypes'

const initialState = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('id_token') ? true : false
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isFetching: true,
                isAuthenticated: false,
                user: action.creds
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                    isFetching: false,
                    isAuthenticated: true,
                    errorMessage: ''
            };

        case LOGIN_FAILURE:
            return {
                ...state,
                    isFetching: false,
                    isAuthenticated: false,
                    errorMessage: action.message
            };

        case LOGOUT_SUCCESS:
            return {
                ...state,
                    isFetching: false,
                    isAuthenticated: false
            };

        default:
            return state
    }

};


export default user;