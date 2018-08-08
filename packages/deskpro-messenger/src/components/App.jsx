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

  state = {
    randomGreeting: Array.isArray(this.props.config.enabledGreetings)
      ? _sample(this.props.config.enabledGreetings)
      : undefined
  };

  componentDidMount() {
    this.setState({ randomGreeting: undefined });
  }

  render() {
    const { config } = this.props;

    return (
      <ConfigProvider value={config}>
        <MemoryRouter>
          <Fragment>
            <Switch>
              <Route path="/screens" component={Window} />
              <Route path="/greetings" component={Greetings} />
              {!!this.state.randomGreeting && (
                <Redirect to={this.state.randomGreeting} />
              )}
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
