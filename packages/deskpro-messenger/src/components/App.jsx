import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Window from './core/Window';
import WidgetToggler from './core/WidgetToggler';
import { ConfigProvider } from './core/ConfigContext';

class App extends PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  static defaultProps = {
    config: {}
  };

  state = { windowVisible: false };

  handleClick = e =>
    this.setState({ windowVisible: !this.state.windowVisible });

  render() {
    return (
      <ConfigProvider value={this.props.config}>
        {this.state.windowVisible && <Window />}
        <WidgetToggler onClick={this.handleClick} />
      </ConfigProvider>
    );
  }
}

export default App;
