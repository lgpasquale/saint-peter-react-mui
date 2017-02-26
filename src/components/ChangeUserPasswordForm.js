import React from 'react';
import { reduxForm, Field } from 'redux-form';
import {TextField} from 'redux-form-material-ui';

const validate = values => {
  const errors = {};
  if (!values.password) {
    errors.password = 'Required';
  }
  if (values.retypedPassword !== values.password) {
    errors.retypedPassword = 'Passwords don\'t match';
  }
  return errors;
};

let ChangeUserPasswordForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field name='password' type='password'
          floatingLabelText='Password' component={TextField} />
      </div>
      <div>
        <Field name='retypedPassword' type='password'
          floatingLabelText='Retype password' component={TextField} />
      </div>
      {/* Hidden submit button,
        the real one is an action of the Dialog component */}
      <input type='submit'
        style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px'}}
        tabIndex='-1'
      />
    </form>
  );
};

export default ChangeUserPasswordForm = reduxForm({
  form: 'changeUserPassword',
  validate
})(ChangeUserPasswordForm);
