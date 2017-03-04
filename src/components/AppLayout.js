import React from 'react';
import { connect } from 'react-redux';
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
      <MenuItem primaryText='Users' onClick={() => props.history.push('/user-management')} />}
    <MenuItem primaryText='Account settings' onClick={() => props.history.push('/account-settings')} />
    <MenuItem primaryText='Sign out' onClick={() => props.logout(props.history)} />
  </IconMenu>
);

class AppLayout extends React.Component {
  render () {
    let adminGroup = this.props.adminGroup || 'admin';
    return (
      <div style={{minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <div>
          <AppBar
            title={this.props.title}
            iconElementLeft={<IconButton onClick={() => this.props.history.push('/')}><Home /></IconButton>}
            iconElementRight={this.props.info.authStatus === AuthStatus.AUTHENTICATED
              ? <AppMenu logout={this.props.logout}
                history={this.props.history}
                isAdmin={this.props.info.groups.indexOf(adminGroup) >= 0} />
              : null} />
        </div>
        <div style={{display: 'flex', flexGrow: '1'}}>
          {this.props.children}
        </div>
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
    logout: (history) => dispatch(logout(() => history.push('/')))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLayout);
