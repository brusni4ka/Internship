import {
    DELETE_STUDENT,
    SAVE_STUDENT,
    EDIT_STUDENT,
} from '../constants/ActionTypes'



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


 