import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import {AuthStatus, readAuthInfoFromLocalStorage, renewToken} from '../actions/authentication-actions';

export default function (ComposedComponent, history) {
  class RequireAuth extends React.Component {
    componentDidMount () {
      if (this.props.authStatus === AuthStatus.UNKNOWN) {
        this.props.readAuthInfoFromLocalStorage();
      } else if (this.props.authStatus === AuthStatus.EXPIRED) {
        this.props.renewToken();
      } else if (this.props.authStatus !== AuthStatus.AUTHENTICATED &&
        this.props.authStatus !== AuthStatus.AUTHENTICATING) {
        history.push('/login');
      }
    }

    componentDidUpdate () {
      if (this.props.authStatus === AuthStatus.UNKNOWN) {
        this.props.readAuthInfoFromLocalStorage();
      } else if (this.props.authStatus === AuthStatus.EXPIRED) {
        this.props.renewToken();
      } else if (this.props.authStatus !== AuthStatus.AUTHENTICATED &&
        this.props.authStatus !== AuthStatus.AUTHENTICATING) {
        history.push('/login');
      }
    }

    render () {
      return (
        (this.props.authStatus === AuthStatus.AUTHENTICATED)
        ? <ComposedComponent {...this.props} />
      : <div style={{width: '40px', margin: '0 auto'}}>
        <CircularProgress
          size={40}
        />
      </div>
      );
    }
  }

  function mapStateToProps (state) {
    return { authStatus: state.auth.info.authStatus };
  }

  function mapDispatchToProps (dispatch) {
    return {
      readAuthInfoFromLocalStorage: () => dispatch(readAuthInfoFromLocalStorage()),
      renewToken: () => dispatch(renewToken('/renew-token', () => history.push('/')))
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequireAuth);
}
