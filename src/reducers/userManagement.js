import {ADD_EXISTING_GROUP,
  ADD_EXISTING_USER,
  REMOVE_DELETED_USER,
  CONFIRM_USER_DELETION,
  EDIT_USER,
  CHANGE_UPDATED_USER,
  CHANGE_USER_PASSWORD} from '../actions/user-management-actions';

var initialState = {
  users: [],
  groups: [],
  deletingUser: '',
  editingUser: '',
  editingUserInfo: {
    username: '',
    firstName: '',
    lastName: '',
    email: ''
  },
  changingPasswordUser: ''
};

export default function userManagement (state = initialState, action) {
  let newUsers;
  switch (action.type) {
    case ADD_EXISTING_GROUP:
      let newGroups = state.groups.slice();
      newGroups.push(action.group);
      return Object.assign({}, state, {groups: newGroups});
    case ADD_EXISTING_USER:
      newUsers = Object.assign({}, state.users);
      newUsers[action.userInfo.username] = action.userInfo;
      return Object.assign({}, state, {users: newUsers});
    case REMOVE_DELETED_USER:
      newUsers = Object.assign({}, state.users);
      delete newUsers[action.username];
      return Object.assign({}, state, {users: newUsers});
    case CONFIRM_USER_DELETION:
      return Object.assign({}, state, {deletingUser: action.username});
    case EDIT_USER:
      let belongsToGroups = {};
      if (action.username !== '') {
        for (let group of state.groups) {
          belongsToGroups['belongsToGroup' + group] =
            state.users[action.username].groups.indexOf(group) > -1;
        }
      }
      return Object.assign({}, state, {
        editingUser: action.username,
        editingUserInfo: Object.assign({}, state.users[action.username],
          belongsToGroups
        )
      });
    case CHANGE_UPDATED_USER:
      // If the username was changed we need to delete the user and create a new one
      newUsers = Object.assign({}, state.users);
      if (action.userInfo.username &&
        action.username !== action.userInfo.username) {
        delete newUsers[action.username];
      }
      newUsers[action.userInfo.username] = action.userInfo;
      return Object.assign({}, state, {users: newUsers});
    case CHANGE_USER_PASSWORD:
      return Object.assign({}, state, {changingPasswordUser: action.username});
    default:
      return state;
  }
}
