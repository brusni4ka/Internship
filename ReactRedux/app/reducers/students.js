import * as types from '../constants/ActionTypes';

const initialState = {
    elements: [
        {
            id: 1,
            name: 'Bob Mitchell',
            department: 'economic department',
            status: 'approved'
        },
        {
            id: 2,
            name: 'Michael Santos',
            department: 'electric machine industry',
            status: 'rejected'
        },
        {
            id: 3,
            name: 'Aladin',
            department: 'computer science and information technologies',
            status: 'approved'
        },
        {
            id: 4,
            name: 'Rose Byrne',
            department: 'mechanical engineering department',
            status: 'uncertain'
        },
        {
            id: 5,
            name: 'Kate Sanders',
            department: 'german technical department',
            status: 'uncertain'
        }

    ],
    editable: null,
};
let id = initialState.elements[initialState.elements.length - 1].id;
    
const studentsReducer = (state = initialState, action) => {
    let  elements;
    switch (action.type) {

        case types.DELETE_STUDENT:
            id--;
            elements = state.elements.filter((el) => el.id !== action.id);
            elements = elements.map((el, i)=> {
                el.id = i + 1;
                return el;
            });
            return { ...state, elements};

        case types.SAVE_STUDENT:
            id++;
            let newStudent = {...action.data, id: id};
            return {...state, elements: [...state.elements, newStudent]};

        case types.EDIT_STUDENT:
            let student = {...action.data};
            elements = state.elements.map(el=>el.id == action.data.id ? el = student : el);
            return {...state, elements};

        default:
            return state;
    }
}

export default studentsReducer;