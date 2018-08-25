import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, Switch, Route, Redirect } from 'react-router-dom';
import _sample from 'lodash/sample';

import Window from './components/core/Window';
import MessengerToggler from './components/core/MessengerToggler';
import Greetings from './components/core/Greetings';
import { ConfigProvider } from './components/core/ConfigContext';
import MessengerAPI from './components/core/MessengerAPI';

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
      : undefined,
    windowVisible: false
  };

  componentDidMount() {
    this.setState({ randomGreeting: undefined });
  }

  toggleWindow = () => {
    this.setState({ windowVisible: !this.state.windowVisible });
  };

  render() {
    const { config } = this.props;
    const { windowVisible, randomGreeting } = this.state;

    return (
      <ConfigProvider value={config}>
        <MemoryRouter>
          <Fragment>
            <Switch>
              <Route
                path="/screens"
                render={(props) => <Window {...props} opened={windowVisible} />}
              />
              <Route path="/greetings" component={Greetings} />
              {!!randomGreeting && <Redirect to={randomGreeting} />}
            </Switch>
            <Route
              render={(props) => (
                <MessengerToggler
                  opened={windowVisible}
                  onToggle={this.toggleWindow}
                  {...props}
                />
              )}
            />
            <Route
              render={(props) => (
                <MessengerAPI
                  opened={windowVisible}
                  onToggle={this.toggleWindow}
                  {...props}
                />
              )}
            />
          </Fragment>
        </MemoryRouter>
      </ConfigProvider>
    );
  }
}

export default App;
