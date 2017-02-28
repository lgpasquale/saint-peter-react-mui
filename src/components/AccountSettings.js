import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import AccountDetails from './AccountDetails';
import ChangeAccountEmailForm from './ChangeAccountEmailForm';
import ChangeAccountPasswordForm from './ChangeAccountPasswordForm';

let AccountSettings = (props) => {
  return (
    <div style={{display: 'flex',
      flexGrow: '1',
      flexDirection: 'row',
      justifyContent: 'center',
      padding: '20px'}}
    >
      <div style={{width: '500px'}}>
        <Card>
          <CardHeader
            title='Account details'
            actAsExpander
            showExpandableButton
          />
          <CardText expandable actAsExpander={false}>
            <AccountDetails />
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title='Change email'
            actAsExpander
            showExpandableButton
          />
          <CardText expandable actAsExpander={false}>
            <ChangeAccountEmailForm authServerURL={props.authServerURL} />
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title='Change password'
            actAsExpander
            showExpandableButton
          />
          <CardText expandable actAsExpander={false}>
            <ChangeAccountPasswordForm authServerURL={props.authServerURL} />
          </CardText>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
