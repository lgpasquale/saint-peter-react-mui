import React from 'react';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Home from 'material-ui/svg-icons/action/home';
import { AuthStatus, logout } from '../actions/authentication-actions';

const AppMenu = (props) => (
  <IconMenu
    iconButtonElement={
      <IconButton><NavigationMenu color={'white'} /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
  >
    {props.isAdmin &&
      <MenuItem primaryText='Users' onClick={() => browserHistory.push('/user-management')} />}
    <MenuItem primaryText='Account settings' onClick={() => browserHistory.push('/account-settings')} />
    <MenuItem primaryText='Sign out' onClick={props.logout} />
  </IconMenu>
);

class App extends React.Component {
  render () {
    let adminGroup = this.props.adminGroup || 'admin';
    return (
      <div>
        <AppBar
          title='DemoApp'
          iconElementLeft={<IconButton onClick={() => browserHistory.push('/')}><Home /></IconButton>}
          iconElementRight={this.props.info.authStatus === AuthStatus.AUTHENTICATED
            ? <AppMenu logout={this.props.logout}
              isAdmin={this.props.info.groups.indexOf(adminGroup) >= 0} />
            : null} />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    info: state.auth.info
  };
}

function mapDispatchToProps (dispatch) {
  return {
    logout: () => dispatch(logout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
