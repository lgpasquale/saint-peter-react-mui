import 'whatwg-fetch';
/* global fetch */

/**
 * Wrapper for fetch that sets the authorization heder
 */
export default function fetchWithJWT (input, init) {
  let initWithJWT = init;
  initWithJWT.headers = initWithJWT.headers || {};
  // try to retrieve the token from local storage
  // if there is no token in local storage fetch anyway
  let authentication = window.localStorage.getItem('authentication');
  if (authentication) {
    try {
      let token = JSON.parse(authentication).token;
      if (token) {
        initWithJWT.headers.Authorization = 'bearer ' + token;
      }
    } catch (e) {
      // no harm done, we will try to fetch anyway without the token
    }
  }
  return fetch(input, initWithJWT);
}
