import 'whatwg-fetch';
import {fetchRenewedToken, updateAuthStatus, loginSuccessful, AuthStatus}
 from './actions/authentication-actions';
/* global fetch */

/**
 * Wrapper for fetch that sets the authorization heder
 */
export default function fetchWithJWT (input, init, dispatch) {
  let initWithJWT = init;
  initWithJWT.headers = initWithJWT.headers || {};
  // try to retrieve the token from local storage
  // if there is no token in local storage fetch anyway
  let authentication = window.localStorage.getItem('authentication');
  if (authentication) {
    try {
      let authInfo = JSON.parse(authentication);
      let token = authInfo.token;
      let tokenExpirationDate = authInfo.tokenExpirationDate;
      if (tokenExpirationDate &&
        (tokenExpirationDate < (new Date()).getTime() / 1000)) {
        // expired token, try to renew it
        return fetchRenewedToken().then((json) => {
          dispatch(loginSuccessful(json.username,
            json.groups,
            json.email,
            json.firstName,
            json.lastName,
            json.token,
            json.tokenExpirationDate
          ));
          initWithJWT.headers.Authorization = 'bearer ' + json.token;
          return fetch(input, initWithJWT);
        }).catch((e) => dispatch(updateAuthStatus(AuthStatus.NONE)));
      } else {
        // token is still valid
        initWithJWT.headers.Authorization = 'bearer ' + token;
        return fetch(input, initWithJWT);
      }
    } catch (e) {
      // no harm done, we will try to fetch anyway without the token
      return fetch(input, initWithJWT);
    }
  }
}
