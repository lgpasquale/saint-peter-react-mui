import fetchWithJWT from '../fetchWithJWT';
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

function loginSuccessful (username, groups, email, firstName, lastName,
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

function expiredToken (username, groups, email, firstName, lastName,
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

function updateAuthStatus (authStatus) {
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
      localState.tokenExpirationDate !== undefined) {
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
 * @param authenticationURL the url where the server provides the resource
 * to authenticate
 */
export function attemptLogin (authenticationURL, username, password, successCallback) {
  return (dispatch, getState) => {
    if (getState().auth.info.authStatus === AuthStatus.AUTHENTICATING) {
      return;
    }
    dispatch(updateAuthStatus(AuthStatus.AUTHENTICATING));
    fetch(authenticationURL, {
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
            tokenExpirationDate: json.tokenExpirationDate
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

/**
 * Attempt to renew a token
 * @param tokenRenewalURL the url where the server provides the resource
 * to renew the token
 */
export function renewToken (tokenRenewalURL, failCallback) {
  return (dispatch, getState) => {
    // don't try to renew the token if there is already
    // an authentication attempt happening
    if (getState().auth.info.authStatus === AuthStatus.AUTHENTICATING) {
      return;
    }
    dispatch(updateAuthStatus(AuthStatus.AUTHENTICATING));
    fetchWithJWT(tokenRenewalURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.status !== 200) {
        dispatch(updateAuthStatus(AuthStatus.NONE));
        if (window.localStorage.getItem('authentication')) {
          window.localStorage.removeItem('authentication');
        }
        failCallback();
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
            tokenExpirationDate: json.tokenExpirationDate
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
      }).catch((e) => {
        console.error('Error: ' + e.message);
      });
    }).catch((e) => {
      console.error('Error: ' + e.message);
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
