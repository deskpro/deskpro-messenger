import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Frame from './Frame';
import { isWindowOpened, toggleWindow, openWindowOnce, windowClosed } from '../../modules/app';
import { ConfigConsumer } from './ConfigContext';
import AutoStart from './AutoStart';

const iframeStyle = {
  position: 'fixed',
  bottom: '14px',
  width: '60px',
  height: '60px'
};

class WidgetToggler extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    autoStart: PropTypes.bool,
    autoStartStyle: PropTypes.string,
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
  state = {
    iframeHeight: '100%'
  };

  autoStartShellRef = createRef();

  recalcIframeHeight = () => {
    if (!this.autoStartShellRef.current) {
      return;
    }
    const rect = this.autoStartShellRef.current.getBoundingClientRect();
    const height = `${rect.height + 60}px`;
    if (height !== this.state.iframeHeight) {
      this.setState({ iframeHeight: height });
    }
  };

  componentDidMount() {
    if (this.props.autoStart) {
      this.interval = setInterval(this.recalcIframeHeight, 250);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
    setTimeout(this.recalcIframeHeight, 250);
  };

  startChart = () => {
    this.props.history.push(`/screens/startChat`);
    this.props.toggleWindow();
    setTimeout(this.recalcIframeHeight, 250);
  };

  renderAutoStart() {
    const { autoStart, opened, autoStartStyle } = this.props;
    if (opened || !autoStart) {
      return null;
    }
    return (
      <div
        ref={this.autoStartShellRef}
      >
        <AutoStart
          autoStartStyle={autoStartStyle}
          startChat={this.startChart}
        />
      </div>
    );
  }

  render() {
    const { opened, themeVars, autoStart, autoStartStyle } = this.props;
    const style = {
      [themeVars.position === 'left' ? 'left' : 'right']: '14px'
    };
    if (autoStart) {
      iframeStyle.height = this.state.iframeHeight;
      iframeStyle.width = '400px';
    }
    return (
      <Frame
        style={{...iframeStyle, ...style}}
      >
        <div className={classNames('dpmsg-TriggerBtn-wrapper', autoStartStyle)}>
          {this.renderAutoStart()}
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
        </div>
      </Frame>
    );
  }
}

const WidgetTogglerWithStyles = (props) => (
  <ConfigConsumer>
    {({ themeVars, autoStart, autoStartStyle }) =>
      <WidgetToggler
        themeVars={themeVars}
        autoStart={autoStart}
        autoStartStyle={autoStartStyle}
        {...props}
      />}
  </ConfigConsumer>
);

export default connect(
  (state) => ({ opened: isWindowOpened(state) }),
  { toggleWindow, openWindowOnce, windowClosed }
)(WidgetTogglerWithStyles);
