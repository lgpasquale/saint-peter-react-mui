import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import {TextField, Checkbox} from 'redux-form-material-ui';

let EditUserForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        <Field name='username' floatingLabelText='Username' component={TextField} />
      </div>
      <div>
        <Field name='firstName' floatingLabelText='First Name' component={TextField} />
      </div>
      <div>
        <Field name='lastName' floatingLabelText='Last Name' component={TextField} />
      </div>
      <div>
        <Field name='email' floatingLabelText='Email' component={TextField} />
      </div>
      <div>
        {props.groups.map((group) =>
          <Field name={'belongsToGroup' + group} key={'belongsToGroup' + group}
            component={Checkbox} label={group} />
        )}
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

EditUserForm = reduxForm({
  form: 'editUser',
  enableReinitialize: true,
  keepDirtyOnReinitialize: false
})(EditUserForm);

const mapStateToProps = (state) => ({
  initialValues: state.auth.userManagement.editingUserInfo,
  groups: state.auth.userManagement.groups
});

export default connect(
  mapStateToProps
)(EditUserForm);
