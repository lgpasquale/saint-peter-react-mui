import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import {AuthStatus, readAuthInfoFromLocalStorage, renewToken} from '../actions/authentication-actions';

export default function (ComposedComponent, history, allowedGroups = []) {
  class RequireAuth extends React.Component {
    componentWillMount () {
      if (this.props.authStatus === AuthStatus.UNKNOWN) {
        this.props.readAuthInfoFromLocalStorage();
      } else if (this.props.authStatus === AuthStatus.EXPIRED) {
        this.props.renewToken();
      } else if (this.props.authStatus !== AuthStatus.AUTHENTICATING &&
        this.props.authStatus !== AuthStatus.AUTHENTICATED) {
        history.push('/login');
      }
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.authStatus === AuthStatus.UNKNOWN) {
        nextProps.readAuthInfoFromLocalStorage();
      } else if (nextProps.authStatus === AuthStatus.EXPIRED) {
        nextProps.renewToken();
      } else if (nextProps.authStatus !== AuthStatus.AUTHENTICATING &&
        nextProps.authStatus !== AuthStatus.AUTHENTICATED) {
        history.push('/login');
      }
    }

    render () {
      let isAllowed = false;
      for (let allowedGroup of allowedGroups) {
        if (this.props.groups.indexOf(allowedGroup) > -1) {
          isAllowed = true;
        }
      }
      return (
        (this.props.authStatus === AuthStatus.AUTHENTICATED &&
        (allowedGroups.length <= 0 || isAllowed))
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
    return {
      authStatus: state.auth.info.authStatus,
      groups: state.auth.info.groups
    };
  }

  function mapDispatchToProps (dispatch) {
    return {
      readAuthInfoFromLocalStorage: () => dispatch(readAuthInfoFromLocalStorage()),
      renewToken: () => dispatch(renewToken(() => history.push('/')))
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequireAuth);
}
