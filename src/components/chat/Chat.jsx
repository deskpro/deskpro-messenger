import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

class Chat extends PureComponent {
  static propTypes = {
    category: PropTypes.string.isRequired
  };

  render() {
    const { baseUrl } = this.props;
    return (
      <Switch>
        <Route
          path={`${baseUrl}/live`}
          render={props => <div>Life chat</div>}
        />
        <Route
          path={`${baseUrl}/step1`}
          render={props => (
            <div>
              Name/Email <Link to={`${baseUrl}/step2`}>Next</Link>
            </div>
          )}
        />
        <Route
          path={`${baseUrl}/step2`}
          render={props => (
            <div>
              Your message <Link to={`${baseUrl}/live`}>Start</Link>
            </div>
          )}
        />
        <Redirect to={`${baseUrl}/step1`} />
      </Switch>
    );
  }
}

export default Chat;
