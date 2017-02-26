import {combineReducers} from 'redux';
import info from './info';
import userManagement from './userManagement';

var auth = combineReducers({
  info,
  userManagement
});

export default auth;
