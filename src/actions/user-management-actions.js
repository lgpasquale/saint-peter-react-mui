import fetchWithJWT from '../fetchWithJWT';

export const ADD_EXISTING_GROUP = 'ADD_EXISTING_GROUP';
export const ADD_EXISTING_USER = 'ADD_EXISTING_USER';
export const REMOVE_DELETED_USER = 'REMOVE_DELETED_USER';
export const CONFIRM_USER_DELETION = 'CONFIRM_USER_DELETION';
export const EDIT_USER = 'EDIT_USER';
export const CHANGE_UPDATED_USER = 'CHANGE_UPDATED_USER';
export const CHANGE_USER_PASSWORD = 'CHANGE_USER_PASSWORD';

export function addExistingGroup (group) {
  return {
    type: ADD_EXISTING_GROUP,
    group: group
  };
}

export function addExistingUser (userInfo) {
  return {
    type: ADD_EXISTING_USER,
    userInfo
  };
}

export function removeDeletedUser (username) {
  return {
    type: REMOVE_DELETED_USER,
    username
  };
}

export function confirmUserDeletion (username) {
  return {
    type: CONFIRM_USER_DELETION,
    username
  };
}

export function editUser (username) {
  return {
    type: EDIT_USER,
    username
  };
}

export function changeUserPassword (username) {
  return {
    type: CHANGE_USER_PASSWORD,
    username
  };
}

export function changeUpdatedUser (username, userInfo) {
  return {
    type: CHANGE_UPDATED_USER,
    username,
    userInfo
  };
}

export function getUsersInfo (usersInfoURL) {
  return (dispatch, getState) => {
    fetchWithJWT(usersInfoURL, {
      method: 'GET'
    }).then((response) => {
      if (response.status !== 200) {
        // TODO: probably dispatch something
        console.error('Could not retrieve user info');
        return;
      }
      response.json().then((json) => {
        for (const username of Object.keys(json)) {
          dispatch(addExistingUser(json[username]));
        }
      }).catch((e) => {
        console.error('Error: ' + e.message);
      });
    }).catch((e) => {
      console.error('Error: ' + e.message);
    });
  };
}

export function getGroups (groupsURL) {
  return (dispatch, getState) => {
    fetchWithJWT(groupsURL, {
      method: 'GET'
    }).then((response) => {
      if (response.status !== 200) {
        // TODO: probably dispatch something
        console.error('Could not retrieve groups');
        return;
      }
      response.json().then((json) => {
        for (const group of json) {
          dispatch(addExistingGroup(group));
        }
      }).catch((e) => {
        console.error('Error: ' + e.message);
      });
    }).catch((e) => {
      console.error('Error: ' + e.message);
    });
  };
}

export function createUser (userCreationURL) {
  return (dispatch, getState) => {
    let username = 'user';
    let counter = 1;
    while (username in getState().auth.userManagement.users) {
      username = 'user' + counter.toString();
      counter++;
    }
    fetchWithJWT(userCreationURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: ''
      })
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error('Could not create user');
      }
      dispatch(addExistingUser({
        username: username,
        email: '',
        firstName: '',
        lastName: '',
        groups: []
      }));
      dispatch(editUser(username));
    }).catch((e) => {
      console.error('Error: ' + e.message);
    });
  };
}

export function deleteUser (userDeletionURL, username) {
  return (dispatch, getState) => {
    // first hide the confirmation dialog
    dispatch(confirmUserDeletion(''));
    fetchWithJWT(userDeletionURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error('Could not delete user');
      }
      dispatch(removeDeletedUser(username));
    }).catch((e) => {
      console.error('Error: ' + e.message);
    });
  };
}

export function updateUserInfo (userInfoUpdateURL, username, userInfo) {
  return (dispatch, getState) => {
    // build the groups array based on the selected checkboxes
    userInfo.groups = [];
    for (let group of getState().auth.userManagement.groups) {
      if (userInfo['belongsToGroup' + group]) {
        userInfo.groups.push(group);
      }
    }
    fetchWithJWT(userInfoUpdateURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        userInfo: userInfo
      })
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error('Could not update user info');
      }
      dispatch(changeUpdatedUser(username, userInfo));
      dispatch(editUser(''));
    }).catch((e) => {
      console.error('Error: ' + e.message);
    });
  };
}

export function resetUserPassword (passwordResetURL, username, password) {
  return (dispatch, getState) => {
    fetchWithJWT(passwordResetURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error('Could not reset password');
      }
      dispatch(changeUserPassword(''));
    }).catch((e) => {
      console.error('Error: ' + e.message);
    });
  };
}
