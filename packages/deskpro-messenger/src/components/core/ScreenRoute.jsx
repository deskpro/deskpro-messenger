import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import makeLoadable from 'react-loadable';

const Loading = ({ error }) =>
  error ? <div>Error: {error}</div> : <div>...</div>;

const ScreenRoute = ({
  screen: { screenType, ...screenProps },
  screenName
}) => {
  const Component = makeLoadable({
    loader: () => import(`../screens/${screenType}`),
    loading: Loading
  });

  return (
    <Route
      render={routeProps => (
        <Component {...routeProps} {...screenProps} screenName={screenName} />
      )}
    />
  );
};

ScreenRoute.propTypes = {
  screen: PropTypes.shape({
    screenType: PropTypes.string.isRequired
  }).isRequired,
  screenName: PropTypes.string.isRequired
};

export default ScreenRoute;
