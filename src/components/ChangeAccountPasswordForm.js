import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import {red500, red200, green200, green500} from 'material-ui/styles/colors';
import {submitChangeAccountPassword} from '../actions/account-settings-actions';

let validate = (values, props) => {
  if (values.newPassword !== values.retypedNewPassword) {
    return {
      newPassword: 'Passwords don\'t match',
      retypedNewPassword: 'Passwords don\'t match'
    };
  }
  return {};
};

let ChangeAccountPasswordForm = (props) => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          <Field name='oldPassword' type='password' component={TextField}
            floatingLabelText='Old password' />
        </div>
        <div>
          <Field name='newPassword' type='password' component={TextField}
            floatingLabelText='New password' />
        </div>
        <div>
          <Field name='retypedNewPassword' type='password' component={TextField}
            floatingLabelText='Retype password' />
        </div>
        <div>
          {props.submitSucceeded && <div style={{padding: '5px',
            border: '2px solid ' + green500,
            backgroundColor: green200
          }}>Succesfully updated password</div>}
          {props.submitFailed && <div style={{padding: '5px',
            border: '2px solid ' + red500,
            backgroundColor: red200
          }}>{props.error}</div>}
        </div>
        <RaisedButton label='Change password' type='submit'
          disabled={props.submitting} primary style={{marginTop: '20px'}} />
      </form>
    </div>
  );
};

ChangeAccountPasswordForm = reduxForm({
  form: 'changeAccountPassword',
  onSubmit: submitChangeAccountPassword,
  validate: validate
})(ChangeAccountPasswordForm);

function mapStateToProps (state) {
  return {
    info: state.auth.info,
    setUserPasswordURL: '/set-user-password'
  };
}

export default connect(
  mapStateToProps
)(ChangeAccountPasswordForm);
