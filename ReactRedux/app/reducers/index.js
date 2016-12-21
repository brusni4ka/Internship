import { combineReducers } from 'redux';

import studentsReducer from './students';
const reducers = {
  students: studentsReducer
};

const rootReducer = combineReducers(reducers);

export default rootReducer;
