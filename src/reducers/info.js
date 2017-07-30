import {UPDATE_AUTH_STATUS, AuthStatus} from '../actions/authentication-actions';

var initialState = {
  authStatus: AuthStatus.UNKNOWN,
  username: '',
  groups: [],
  email: '',
  token: '',
  tokenExpirationDate: 0,
  renewTokenURL: ''
};

export default function authentication (state = initialState, action) {
  switch (action.type) {
    case UPDATE_AUTH_STATUS:
      switch (action.authStatus) {
        case AuthStatus.AUTHENTICATED:
        case AuthStatus.EXPIRED:
          return Object.assign({}, state, {
            authStatus: action.authStatus,
            username: action.username,
            groups: action.groups,
            email: action.email,
            token: action.token,
            tokenExpirationDate: action.tokenExpirationDate,
            renewTokenURL: action.renewTokenURL
          });
        case AuthStatus.AUTHENTICATING:
          return Object.assign({}, state, {authStatus: AuthStatus.AUTHENTICATING});
        default: // FAILURE, NONE, UNKNOWN
          return Object.assign({}, initialState, {authStatus: action.authStatus});
      }
    default:
      return state;
  }
}
