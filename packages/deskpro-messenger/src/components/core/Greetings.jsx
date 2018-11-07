import React, { PureComponent, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import Frame from './Frame';
import { withConfig } from './ConfigContext';

const frameStyles = {
  bottom: '104px',
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
        <Suspense
          fallback={
            <div className="dpmsg-Block">
              <p>Loading...</p>
            </div>
          }
        >
          <Switch>
            {Object.entries(greetings).map(
              ([greetingName, { greetingType }]) => (
                <Route
                  key={greetingName}
                  path={`/greetings/${greetingName}`}
                  render={(routerProps) =>
                    React.createElement(
                      lazy(() => import(`../../greetings/${greetingType}`)),
                      routerProps
                    )
                  }
                />
              )
            )}
          </Switch>
        </Suspense>
      </Frame>
    );
  }
}

export default withConfig(Greetings);
