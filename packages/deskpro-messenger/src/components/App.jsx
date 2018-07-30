import React, { Fragment, PureComponent } from 'react';

import Window from './core/Window';
import WidgetToggler from './core/WidgetToggler';

class App extends PureComponent {
  state = { windowVisible: false };

  handleClick = e =>
    this.setState({ windowVisible: !this.state.windowVisible });

  render() {
    return (
      <Fragment>
        {this.state.windowVisible && <Window />}
        <WidgetToggler onClick={this.handleClick} />
      </Fragment>
    );
  }
}

export default App;
