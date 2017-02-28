import 'whatwg-fetch';
/* global fetch */

export var AuthStatus = {
  UNKNOWN: 'UNKNOWN', // we haven't even tried to retrieve auth info from localStorage
  NONE: 'NONE', // user needs to login
  AUTHENTICATING: 'AUTHENTICATING', // auth request has been sent
  FAILURE: 'FAILURE', // auth request failed
  AUTHENTICATED: 'AUTHENTICATED', // successfully logged in
  EXPIRED: 'EXPIRED' // token needs to be renewd

};

export const UPDATE_AUTH_STATUS = 'UPDATE_AUTH_STATUS';

export function loginSuccessful (username, groups, email, firstName, lastName,
  token, tokenExpirationDate) {
  return {
    type: UPDATE_AUTH_STATUS,
    authStatus: AuthStatus.AUTHENTICATED,
    username,
    groups,
    email,
    firstName,
    lastName,
    token,
    tokenExpirationDate
  };
}

export function expiredToken (username, groups, email, firstName, lastName,
  token, tokenExpirationDate) {
  return {
    type: UPDATE_AUTH_STATUS,
    authStatus: AuthStatus.EXPIRED,
    username,
    groups,
    email,
    firstName,
    lastName,
    token,
    tokenExpirationDate
  };
}

export function updateAuthStatus (authStatus) {
  return {
    type: UPDATE_AUTH_STATUS,
    authStatus: authStatus
  };
}

/**
 * Try to retreieve authentication info from local storage
 */
export function readAuthInfoFromLocalStorage () {
  return (dispatch, getState) => {
    // try to retrieve the authentication state from the localStorage
    let localState = {};
    if (window.localStorage.authentication) {
      localState = JSON.parse(window.localStorage.authentication);
    }
    // only load the initial state from the storage
    // if all the needed fields can be found
    if (localState &&
      localState.username !== undefined &&
      localState.groups !== undefined &&
      localState.email !== undefined &&
      localState.firstName !== undefined &&
      localState.lastName !== undefined &&
      localState.token !== undefined &&
      localState.tokenExpirationDate !== undefined &&
      localState.renewTokenURL !== undefined) {
      // localStorage.authentication conatins all the needed fields
      if (localState.tokenExpirationDate > (new Date()).getTime() / 1000) {
        dispatch(loginSuccessful(localState.username,
          localState.groups,
          localState.email,
          localState.firstName,
          localState.lastName,
          localState.token,
          localState.tokenExpirationDate
        ));
      } else {
        dispatch(expiredToken(localState.username,
          localState.groups,
          localState.email,
          localState.firstName,
          localState.lastName,
          localState.token,
          localState.tokenExpirationDate
        ));
      }
    } else {
      // either localStorage doesn't contain any auth info or they are incomplete
      dispatch(updateAuthStatus(AuthStatus.NONE));
    }
  };
}

/**
 * Attempt to login
 * @param authenticateURL url where the server provides the resource
 * to authenticate
 * @param renewTokenURL url where an expired token can be renewed (not used here but saved in local storage for future use)
 */
export function attemptLogin (authenticateURL, renewTokenURL,
  username, password, successCallback) {
  return (dispatch, getState) => {
    if (getState().auth.info.authStatus === AuthStatus.AUTHENTICATING) {
      return;
    }
    dispatch(updateAuthStatus(AuthStatus.AUTHENTICATING));
    fetch(authenticateURL, {
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
        dispatch(updateAuthStatus(AuthStatus.FAILURE));
        if (window.localStorage.getItem('authentication')) {
          window.localStorage.removeItem('authentication');
        }
        return;
      }
      response.json().then((json) => {
        window.localStorage.setItem('authentication', JSON.stringify(
          {
            username: json.username,
            groups: json.groups,
            email: json.email,
            firstName: json.firstName,
            lastName: json.lastName,
            token: json.token,
            tokenExpirationDate: json.tokenExpirationDate,
            renewTokenURL: renewTokenURL
          }
        ));
        dispatch(loginSuccessful(json.username,
          json.groups,
          json.email,
          json.firstName,
          json.lastName,
          json.token,
          json.tokenExpirationDate
        ));
        successCallback();
      }).catch((e) => {
        console.error('Error ' + e.message);
      });
    }).catch((e) => {
      console.error('Error ' + e.message);
    });
  };
}

export function fetchRenewedToken () {
  return new Promise((resolve, reject) => {
    // try to retrieve the token and the URL where it can be renewed
    // from local storage
    let authentication = window.localStorage.getItem('authentication');
    if (!authentication) {
      reject(new Error('No token in localStorage'));
    }
    let authInfo = JSON.parse(authentication);
    let token = authInfo.token;
    let renewTokenURL = authInfo.renewTokenURL;
    if (!token || !renewTokenURL) {
      return reject(new Error('No token in localStorage'));
    }
    fetch(renewTokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
      }
    }).then((response) => {
      if (response.status !== 200) {
        if (window.localStorage.getItem('authentication')) {
          window.localStorage.removeItem('authentication');
        }
        return reject(new Error('HTTP error ' + response.status +
          'trying to renew token'));
      }
      response.json().then((json) => {
        window.localStorage.setItem('authentication', JSON.stringify(
          {
            username: json.username,
            groups: json.groups,
            email: json.email,
            firstName: json.firstName,
            lastName: json.lastName,
            token: json.token,
            tokenExpirationDate: json.tokenExpirationDate,
            renewTokenURL: renewTokenURL
          }
        ));
        return resolve(json);
      }).catch((e) => reject(e));
    });
  });
}

/**
 * Attempt to renew a token
 * @param failCallback callback called if token renewal fails
 */
export function renewToken (failCallback) {
  return (dispatch, getState) => {
    fetchRenewedToken().then((json) => {
      dispatch(loginSuccessful(json.username,
        json.groups,
        json.email,
        json.firstName,
        json.lastName,
        json.token,
        json.tokenExpirationDate
      ));
    }).catch((e) => {
      dispatch(updateAuthStatus(AuthStatus.NONE));
      failCallback();
    });
  };
}

export function logout (successCallback) {
  return (dispatch, getState) => {
    dispatch(updateAuthStatus(AuthStatus.NONE));
    if (window.localStorage.authentication) {
      window.localStorage.removeItem('authentication');
    }
    successCallback();
  };
}
