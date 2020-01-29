import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Frame from './Frame';
import { isWindowOpened, toggleWindow, openWindowOnce, windowClosed } from '../../modules/app';
import { ConfigConsumer } from './ConfigContext';

const iframeStyle = {
  position: 'fixed',
  bottom: '14px',
  width: '60px',
  height: '60px'
};

class WidgetToggler extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    toggleWindow: PropTypes.func.isRequired,
    openWindowOnce: PropTypes.func.isRequired,
    windowClosed: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  handleTogglerClick = (e) => {
    e.preventDefault();

    const { opened, location, history, openWindowOnce, toggleWindow, windowClosed } = this.props;

    if (!opened) {
      openWindowOnce();
      if (!location.pathname.startsWith('/screens')) {
        history.push(`/screens/index`);
      }
    } else {
      windowClosed();
    }
    toggleWindow();
  };

  render() {
    const { opened, themeVars } = this.props;
    const style = {
      [themeVars.position === 'left' ? 'left' : 'right']: '14px'
    };
    return (
      <Frame style={{...iframeStyle, ...style}}>
        <button
          style={{
            background: this.props.themeVars['--color-primary'],
            border: `1px solid ${this.props.themeVars['--color-primary']}`
          }}
          className={classNames(`dpmsg-TriggerBtn color--primary`)}
          onClick={this.handleTogglerClick}
        >
          {opened ? (
            <i className="dpmsg-Icon dpmsg-IconClose" />
          ) : (
            <i className="dpmsg-Icon dpmsg-IconChat" />
          )}
        </button>
      </Frame>
    );
  }
}

const WidgetTogglerWithStyles = (props) => (
  <ConfigConsumer>
    {({ themeVars }) => <WidgetToggler themeVars={themeVars} {...props} />}
  </ConfigConsumer>
);

export default connect(
  (state) => ({ opened: isWindowOpened(state) }),
  { toggleWindow, openWindowOnce, windowClosed }
)(WidgetTogglerWithStyles);
