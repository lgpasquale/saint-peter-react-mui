import {SubmissionError} from 'redux-form';
import fetchWithJWT from '../fetchWithJWT';

export const CHANGE_ACCOUNT_SETTINGS_PAGE = 'CHANGE_ACCOUNT_SETTINGS_PAGE';
export const ACCOUNT_SETTINGS_DETAILS_PAGE = 'ACCOUNT_SETTINGS_DETAILS_PAGE';
export const ACCOUNT_SETTINGS_CHANGE_EMAIL_PAGE = 'ACCOUNT_SETTINGS_CHANGE_EMAIL_PAGE';
export const ACCOUNT_SETTINGS_CHAGE_PASSWORD_PAGE = 'ACCOUNT_SETTINGS_CHAGE_PASSWORD_PAGE';

export function changeAccountSettingsPage (page) {
  return {
    type: CHANGE_ACCOUNT_SETTINGS_PAGE,
    page: page
  };
}

/**
 * Function passed as onSubmit to ChangeAccountEmailForm
 */
export function submitChangeAccountEmail (values, dispatch, props) {
  return fetchWithJWT(props.setUserEmailURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: props.info.username,
      email: values.email
    })
  }).then((response) => {
    if (response.status !== 200) {
      throw new SubmissionError({_error: 'Error updating email'});
    }
    response.json().then((json) => {
      window.localStorage.setItem('authentication', JSON.stringify(
        {
          username: props.info.username,
          groups: props.info.groups,
          email: values.email,
          token: props.info.token,
          tokenExpirationDate: props.info.tokenExpirationDate
        }
      ));
    }).catch((e) => {
      console.error('Error ' + e.message);
      throw new SubmissionError({_error: 'Error updating email'});
    });
  }).catch((e) => {
    console.error('Error ' + e.message);
    throw new SubmissionError({_error: 'Error updating email'});
  });
}

/**
 * Function passed as onSubmit to ChangeAccountPasswordForm
 */
export function submitChangeAccountPassword (values, dispatch, props) {
  return fetchWithJWT(props.setUserPasswordURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: props.info.username,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    })
  }).then((response) => {
    if (response.status !== 200) {
      throw new SubmissionError({_error: 'Error updating password'});
    }
  }).catch((e) => {
    console.error('Error ' + e.message);
    throw new SubmissionError({_error: 'Error updating password'});
  });
}
