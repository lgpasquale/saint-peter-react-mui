import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import {TextField} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {attemptLogin, AuthStatus} from '../actions/authentication-actions';

let submitLoginForm = (values, dispatch, props) =>
  dispatch(attemptLogin(props.authServerURL + '/authenticate', values.username, values.password,
    () => props.history.push('')
  ));

let LoginForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div style={{maxWidth: '400px',
        margin: '0 auto',
        position: 'absolute',
        top: '120px',
        left: '50%',
        transform: 'translate(-50%,0)'
      }}>
        <Paper>
          <Toolbar>
            <ToolbarGroup lastChild>
              <ToolbarTitle text='Login' />
            </ToolbarGroup>
          </Toolbar>
          <div style={{padding: '20px', textAlign: 'center'}}>
            <div>
              <Field name='username' component={TextField} type='text'
                floatingLabelText='Username'
                hintText='username'
              />
            </div>
            <div>
              <Field name='password' component={TextField} type='password'
                floatingLabelText='Password' hintText='password' />
            </div>
            {props.authStatus === AuthStatus.AUTHENTICATING &&
              'Authenticating...'}
            {props.authStatus === AuthStatus.FAILURE &&
              <div style={{color: 'red'}}>Wrong username or password</div>}
            <div style={{textAlign: 'right'}}>
              <RaisedButton type='submit' style={{width: '100%', marginTop: '20px'}}
                label='SIGN IN' primary />
            </div>
          </div>
        </Paper>
      </div>
    </form>
  );
};

LoginForm = reduxForm({
  form: 'loginForm',
  onSubmit: submitLoginForm
})(LoginForm);

const mapStateToProps = (state) => {
  return {
    authStatus: state.auth.info.authStatus
  };
};

export default connect(
  mapStateToProps
)(LoginForm);
