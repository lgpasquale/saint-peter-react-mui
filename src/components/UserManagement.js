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
    this.props.getUsersInfo();
    this.props.getGroups();
  }
  render () {
    let users = this.props.users;
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
          onClick={this.props.createUser} primary />
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
                          onClick={() => this.props.editUser(username)}
                          style={buttonStyle}
                          icon={<EditorModeEdit />}
                          primary
                        />
                        <RaisedButton
                          onClick={() => this.props.confirmUserDeletion(username)}
                          style={buttonStyle}
                          icon={<ActionDelete />}
                          primary
                        />
                        <RaisedButton label='Change password'
                          onClick={() => this.props.changeUserPassword(username)}
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
          title={'Delete user \'' + this.props.deletingUser + '\'?'}
          actions={[
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Cancel'
              onTouchTap={() => this.props.confirmUserDeletion('')}
            />,
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Delete'
              keyboardFocused
              onTouchTap={() => this.props.deleteUser(this.props.deletingUser)}
            />
          ]}
          modal={false}
          open={this.props.deletingUser !== ''}
          onRequestClose={() => this.props.confirmUserDeletion('')}
        />
        <Dialog
          title={'Edit user'}
          contentStyle={{width: '500px'}}
          autoScrollBodyContent
          modal={false}
          open={this.props.editingUser !== ''}
          onRequestClose={() => this.props.editUser('')}
          actions={[
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Cancel'
              onTouchTap={() => this.props.editUser('')}
            />,
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Save'
              onTouchTap={this.props.submitEditUser}
            />
          ]}
        >
          <EditUserForm onSubmit={(values) => this.props.updateUserInfo(
              this.props.editingUser, values
          )} />
        </Dialog>
        <Dialog
          title={'Change password'}
          contentStyle={{width: '500px'}}
          modal={false}
          open={this.props.changingPasswordUser !== ''}
          onRequestClose={() => this.props.changeUserPassword('')}
          actions={[
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Cancel'
              onTouchTap={() => this.props.changeUserPassword('')}
            />,
            <RaisedButton
              style={{margin: '5px'}}
              primary
              label='Save'
              onTouchTap={this.props.submitChangeUserPassword}
            />
          ]}
        >
          <ChangeUserPasswordForm
            onSubmit={(values) => this.props.resetUserPassword(
              this.props.changingPasswordUser, values.password)}
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

function mapDispatchToProps (dispatch) {
  return {
    getUsersInfo: () => dispatch(getUsersInfo('/users-info')),
    getGroups: () => dispatch(getGroups('/groups')),
    createUser: () => dispatch(createUser('/add-user')),
    deleteUser: (username) => dispatch(deleteUser('/delete-user', username)),
    confirmUserDeletion: (username) => dispatch(confirmUserDeletion(username)),
    editUser: (username) => dispatch(editUser(username)),
    updateUserInfo: (username, userInfo) =>
      dispatch(updateUserInfo('/set-user-info', username, userInfo)),
    submitEditUser: () => dispatch(submit('editUser')),
    changeUserPassword: (username) => dispatch(changeUserPassword(username)),
    resetUserPassword: (username, password) =>
      dispatch(resetUserPassword('/reset-user-password', username, password)),
    submitChangeUserPassword: () => dispatch(submit('changeUserPassword'))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement);
