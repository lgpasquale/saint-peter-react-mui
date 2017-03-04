import React from 'react';
import {hashHistory, Router, Route, IndexRedirect} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppLayout from './AppLayout';
import LoginForm from './LoginForm';
import AccountSettings from './AccountSettings';
import UserManagement from './UserManagement';
import RequireAuth from './RequireAuth';
import PageNotFound from './PageNotFound';

class App extends React.Component {
  render () {
    return (
      <MuiThemeProvider>
        <Router history={this.props.history}>
          <Route path='/' component={(props) =>
            (<AppLayout title={this.props.title}
              history={this.props.history} children={props.children} />)
          }>
            <IndexRedirect to={this.props.mainPath} />
            <Route path={this.props.mainPath} component={this.props.mainComponent}>
              {this.props.routes}
            </Route>
            <Route path='login' component={
              () => (<LoginForm history={this.props.history}
                authServerURL={this.props.authServerURL}
              />)}
            />
            <Route path='account-settings' component={
              RequireAuth(() => (<AccountSettings
                authServerURL={this.props.authServerURL}
              />), this.props.history)} />
            <Route path='user-management' component={
              RequireAuth(() => (<UserManagement
                authServerURL={this.props.authServerURL}
              />), this.props.history)} />
            <Route path='*' component={PageNotFound} />
          </Route>
        </Router>
      </MuiThemeProvider>
    );
  }
}

App.defaultProps = {
  mainPath: 'app',
  history: hashHistory
};

export default App;
