import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

import Window from './core/Window';
import WidgetToggler from './core/WidgetToggler';
import Greetings from './core/Greetings';
import { ConfigProvider } from './core/ConfigContext';

class App extends PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  static defaultProps = {
    config: {}
  };

  render() {
    return (
      <ConfigProvider value={this.props.config}>
        <MemoryRouter>
          <Fragment>
            <Switch>
              <Route path="/screens" component={Window} />
              <Route path="/greetings" component={Greetings} />
            </Switch>
            <Route component={WidgetToggler} />
          </Fragment>
        </MemoryRouter>
      </ConfigProvider>
    );
  }
}

export default App;
