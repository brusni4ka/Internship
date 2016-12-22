/**
 * Created by kate on 19/12/16.
 */
export const remove = (id) => ({
    type: 'DELETE_STUDENT',
    id
});


export const save = (data)=> {
    return ({
        type: 'SAVE_STUDENT',
        data
    })
};

export const edit = (data)=> {
    return ({
        type: 'EDIT_STUDENT',
        data:data
    })
};



 