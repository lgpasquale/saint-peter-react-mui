import React from 'react';
import {connect} from 'react-redux';

class AccountDetails extends React.Component {
  render () {
    return (
      <div>
        <p>Username: {this.props.info.username} </p>
        <p>e-mail: {this.props.info.email} </p>
        <p>groups: {this.props.info.groups.join(', ')} </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  info: state.auth.info
});

export default connect(
  mapStateToProps
)(AccountDetails);
