import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

class ScreenRoute extends React.PureComponent {
  static propTypes = {
    screen: PropTypes.shape({
      screenType: PropTypes.string.isRequired
    }).isRequired,
    screenName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  };

  component = lazy(() =>
    import(`../../screens/${this.props.screen.screenType}`)
  );

  render() {
    const {
      screen: { screenType, ...screenProps },
      screenName
    } = this.props;

    return (
      <Route
        path={this.props.path}
        render={(routeProps) =>
          React.createElement(this.component, {
            ...routeProps,
            ...screenProps,
            screenName
          })
        }
      />
    );
  }
}

export default ScreenRoute;
