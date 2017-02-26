import React from 'react';
import {browserHistory, Router, Route, IndexRedirect} from 'react-router';
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
            (<AppLayout history={this.props.history} children={props.children} />)
          }>
            <IndexRedirect to={this.props.mainPath} />
            <Route path={this.props.mainPath} component={this.props.mainComponent}>
              {this.props.routes}
            </Route>
            <Route path='login' component={
              () => (<LoginForm history={this.props.history} />)}
            />
            <Route path='account-settings' component={
              RequireAuth(AccountSettings, this.props.history)} />
            <Route path='user-management' component={
              RequireAuth(UserManagement, this.props.history)} />
            <Route path='*' component={PageNotFound} />
          </Route>
        </Router>
      </MuiThemeProvider>
    );
  }
}

App.defaultProps = {
  mainPath: 'app',
  history: browserHistory
};

export default App;
