import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Frame from './Frame';
import { withConfig } from './ConfigContext';

const frameStyles = {
  bottom: '54px',
  width: '250px',
  height: '100px',
  border: '1px solid #aaa',
  borderRadius: '3px',
  backgroundColor: '#ddd'
};

class Greetings extends PureComponent {
  static propTypes = {
    greetings: PropTypes.object
  };

  static defaultProps = {
    greetings: {}
  };

  render() {
    const { greetings } = this.props;

    return (
      <Frame style={frameStyles}>
        <Switch>
          {Object.entries(greetings).map(([greetingName, { greetingType }]) => (
            <Route
              key={greetingName}
              path={`/greetings/${greetingName}`}
              component={Loadable({
                loader: () => import(`../greetings/${greetingType}`),
                loading: ({ error }) => (error ? <p>{error}</p> : '...')
              })}
            />
          ))}
        </Switch>
      </Frame>
    );
  }
}

export default withConfig(Greetings);
