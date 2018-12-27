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

  component = lazy(() => {
    const {
      screen: { screenType },
      screenName
    } = this.props;

    if (!screenType) {
      throw Error(`Missing \`screenType\` for the screen '${screenName}'`);
    }

    return import(`../../screens/${screenType}`).catch(() =>
      console.error(
        `Unknown screen type \`${screenType}\` is specified for the \`${screenName}\`.`
      )
    );
  });

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
