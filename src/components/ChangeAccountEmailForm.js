import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import {red500, red200, green200, green500} from 'material-ui/styles/colors';
import {submitChangeAccountEmail} from '../actions/account-settings-actions';

let ChangeAccountEmailForm = (props) => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          <Field name='email' type='text' component={TextField}
            floatingLabelText='e-mail' />
        </div>
        <div>
          {props.submitSucceeded && <div style={{padding: '5px',
            border: '2px solid ' + green500,
            backgroundColor: green200
          }}>Succesfully updated email address</div>}
          {props.submitFailed && <div style={{padding: '5px',
            border: '2px solid ' + red500,
            backgroundColor: red200
          }}>{props.error}</div>}
        </div>
        <RaisedButton label='Change email' type='submit'
          disabled={props.submitting} primary style={{marginTop: '20px'}} />
      </form>
    </div>
  );
};

ChangeAccountEmailForm = reduxForm({
  form: 'changeAccountEmail',
  onSubmit: submitChangeAccountEmail
})(ChangeAccountEmailForm);

function mapStateToProps (state) {
  return {
    initialValues: {email: state.auth.info.email},
    info: state.auth.info,
    setUserEmailPath: '/set-user-email'
  };
}

export default connect(
  mapStateToProps
)(ChangeAccountEmailForm);
