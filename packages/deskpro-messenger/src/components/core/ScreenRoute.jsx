import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import makeLoadable from 'react-loadable';

const Loading = ({ error }) =>
  error ? <div>Error: {error}</div> : <div>...</div>;

class ScreenRoute extends React.PureComponent {
  static propTypes = {
    screen: PropTypes.shape({
      screenType: PropTypes.string.isRequired
    }).isRequired,
    screenName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  };
  component = makeLoadable({
    loader: () => import(`../../screens/${this.props.screen.screenType}`),
    loading: Loading
  });

  render() {
    const {
      screen: { screenType, ...screenProps },
      screenName
    } = this.props;

    const Component = this.component;

    return (
      <Route path={this.props.path}>
        {(routeProps) => (
          <Component {...routeProps} {...screenProps} screenName={screenName} />
        )}
      </Route>
    );
  }
}

export default ScreenRoute;
