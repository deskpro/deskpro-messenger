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
    const { windowVisible } = this.state;
    return (
      <ConfigProvider value={this.props.config}>
        {windowVisible && <Window />}
        <WidgetToggler onClick={this.handleClick} state={windowVisible} />
      </ConfigProvider>
    );
  }
}

export default App;
