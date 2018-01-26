import React from 'react';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import {submit} from 'redux-form';
import EditUserForm from './EditUserForm';
import ChangeUserPasswordForm from './ChangeUserPasswordForm';
import {getUsersInfo,
  getGroups,
  createUser,
  deleteUser,
  confirmUserDeletion,
  editUser,
  updateUserInfo,
  changeUserPassword,
  resetUserPassword} from '../actions/user-management-actions';

class UserManagement extends React.Component {
  componentDidMount () {
    let {authServerURL, dispatch} = this.props;
    dispatch(getUsersInfo(authServerURL));
    dispatch(getGroups(authServerURL));
  }

  render () {
    let {authServerURL, users, editingUser, deletingUser, changingPasswordUser,
      dispatch} = this.props;
    let buttonStyle = {minWidth: '36px', margin: '2px'};
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px'
      }}
      >
        <RaisedButton label='Create user'
          onClick={() => dispatch(createUser(authServerURL))} primary />
        <div style={{paddingTop: '20px'}}>
          <Paper>
            <Table selectable={false}>
              <TableHeader adjustForCheckbox={false}
                displaySelectAll={false} enableSelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Username</TableHeaderColumn>
                  <TableHeaderColumn>First Name</TableHeaderColumn>
                  <TableHeaderColumn>Last Name</TableHeaderColumn>
                  <TableHeaderColumn>Email</TableHeaderColumn>
                  <TableHeaderColumn>Groups</TableHeaderColumn>
                  <TableHeaderColumn style={{width: '300px'}}>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Object.keys(users).sort().map((username) => (
                  <TableRow key={username} selectable={false}>
                    <TableRowColumn>{users[username].username}</TableRowColumn>
                    <TableRowColumn>{users[username].firstName}</TableRowColumn>
                    <TableRowColumn>{users[username].lastName}</TableRowColumn>
                    <TableRowColumn>{users[username].email}</TableRowColumn>
                    <TableRowColumn>{users[username].groups.join(',')}</TableRowColumn>
                    <TableRowColumn style={{width: '280px'}}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}>
                        <RaisedButton
                          onClick={() => dispatch(editUser(username))}
                          style={buttonStyle}
                          icon={<EditorModeEdit />}
                          primary
                        />
                        <RaisedButton
                          onClick={() => dispatch(confirmUserDeletion(username))}
                          style={buttonStyle}
                          icon={<ActionDelete />}
                          primary
                        />
                        <RaisedButton label='Change password'
                          onClick={() => dispatch(changeUserPassword(username))}
                          style={buttonStyle}
                          primary />
                      </div>
                    </TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
        <Dialog
          title={'Delete user \'' + deletingUser + '\'?'}
          actions={[
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Cancel'
              onTouchTap={() => dispatch(confirmUserDeletion(''))}
            />,
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Delete'
              keyboardFocused
              onTouchTap={() => dispatch(deleteUser(authServerURL, deletingUser))}
            />
          ]}
          modal={false}
          open={deletingUser !== ''}
          onRequestClose={() => dispatch(confirmUserDeletion(''))}
        />
        <Dialog
          title={'Edit user'}
          contentStyle={{width: '500px'}}
          autoScrollBodyContent
          modal={false}
          open={editingUser !== ''}
          onRequestClose={() => dispatch(editUser(''))}
          actions={[
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Cancel'
              onTouchTap={() => dispatch(editUser(''))}
            />,
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Save'
              onTouchTap={() => dispatch(submit('editUser'))}
            />
          ]}
        >
          <EditUserForm onSubmit={(values) => dispatch(
            updateUserInfo(authServerURL, editingUser, values
          ))} />
        </Dialog>
        <Dialog
          title={'Change password'}
          contentStyle={{width: '500px'}}
          modal={false}
          open={changingPasswordUser !== ''}
          onRequestClose={() => dispatch(changeUserPassword(''))}
          actions={[
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Cancel'
              onTouchTap={() => dispatch(changeUserPassword(''))}
            />,
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Save'
              onTouchTap={() => dispatch(submit('changeUserPassword'))}
            />
          ]}
        >
          <ChangeUserPasswordForm
            onSubmit={(values) => dispatch(
              resetUserPassword(authServerURL, changingPasswordUser, values.password))}
          />
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    users: state.auth.userManagement.users,
    editingUser: state.auth.userManagement.editingUser,
    deletingUser: state.auth.userManagement.deletingUser,
    changingPasswordUser: state.auth.userManagement.changingPasswordUser
  };
}

export default connect(
  mapStateToProps
)(UserManagement);
