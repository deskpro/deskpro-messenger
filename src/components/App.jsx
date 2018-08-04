import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, Switch, Route, Redirect } from 'react-router-dom';
import _sample from 'lodash/sample';

import Window from './core/Window';
import WidgetToggler from './core/WidgetToggler';
import Greetings from './core/Greetings';
import { ConfigProvider } from './core/ConfigContext';
import WidgetAPI from './core/WidgetAPI';

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
            <Route component={WidgetToggler} />
            <Route component={WidgetAPI} />
          </Fragment>
        </MemoryRouter>
      </ConfigProvider>
    );
  }
}

export default App;
