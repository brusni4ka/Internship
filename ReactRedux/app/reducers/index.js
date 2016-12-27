import { combineReducers } from 'redux';
import user from './user'
import students from './students';
const reducers = {
  students,
  user
};

const rootReducer = combineReducers(reducers);

export default rootReducer;
