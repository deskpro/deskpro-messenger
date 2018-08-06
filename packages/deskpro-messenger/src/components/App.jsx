import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, Switch, Route, Redirect } from 'react-router-dom';
import _sample from 'lodash/sample';

import Window from './core/Window';
import MessengerToggler from './core/MessengerToggler';
import Greetings from './core/Greetings';
import { ConfigProvider } from './core/ConfigContext';
import MessengerAPI from './core/MessengerAPI';

class App extends PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  static defaultProps = {
    config: {}
  };

  render() {
    const { config } = this.props;
    const randomGreeting =
      Array.isArray(config.enabledGreetings) &&
      _sample(config.enabledGreetings);

    return (
      <ConfigProvider value={config}>
        <MemoryRouter>
          <Fragment>
            <Switch>
              <Route path="/screens" component={Window} />
              <Route path="/greetings" component={Greetings} />
              {!!randomGreeting && <Redirect to={randomGreeting} />}
            </Switch>
            <Route component={MessengerToggler} />
            <Route component={MessengerAPI} />
          </Fragment>
        </MemoryRouter>
      </ConfigProvider>
    );
  }
}

export default App;
