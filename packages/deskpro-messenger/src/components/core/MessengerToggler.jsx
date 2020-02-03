import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { canUseChat, getAgentsAvailable } from "../../modules/info";
import Frame from './Frame';
import { isWindowOpened, toggleWindow, openWindowOnce, proactiveWindowClosed } from '../../modules/app';
import { ConfigConsumer } from './ConfigContext';
import AutoStart from './AutoStart';
import cache from '../../services/Cache';

const iframeStyle = {
  position: 'fixed',
  bottom:   '14px',
  width:    '60px',
  height:   '60px'
};

class WidgetToggler extends PureComponent {
  static propTypes = {
    opened:                PropTypes.bool,
    autoStart:             PropTypes.bool,
    autoStartTimeout:      PropTypes.number,
    autoStartStyle:        PropTypes.string,
    toggleWindow:          PropTypes.func.isRequired,
    openWindowOnce:        PropTypes.func.isRequired,
    proactiveWindowClosed: PropTypes.func.isRequired,
    location:              PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    history:               PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };
  state            = {
    iframeHeight:       '100%',
    canRenderAutoStart: false,
  };

  autoStartShellRef = createRef();

  recalcIframeHeight = () => {
    if (!this.autoStartShellRef.current) {
      return;
    }
    const rect   = this.autoStartShellRef.current.getBoundingClientRect();
    const height = `${rect.height + 60}px`;
    if (height !== this.state.iframeHeight) {
      this.setState({ iframeHeight: height });
    }
  };

  componentDidMount() {
    const { autoStart, autoStartTimeout } = this.props;

    if (autoStart) {
      if (autoStartTimeout) {
        setTimeout(() => this.setState({ canRenderAutoStart: true }), autoStartTimeout * 1000)
      } else {
        this.setState({ canRenderAutoStart: true })
      }
      this.interval = setInterval(this.recalcIframeHeight, 250);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleTogglerClick = (e) => {
    e.preventDefault();

    const { opened, location, history, openWindowOnce, toggleWindow } = this.props;

    if (!opened) {
      openWindowOnce();
      if (!location.pathname.startsWith('/screens')) {
        history.push(`/screens/index`);
      }
    }

    toggleWindow();
    setTimeout(this.recalcIframeHeight, 250);
  };

  onProactiveClose = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({ canRenderAutoStart: false }, () => this.props.proactiveWindowClosed());
  };

  startChart = () => {
    this.props.history.push(`/screens/startChat`);
    this.props.toggleWindow();
    this.props.proactiveWindowClosed();
    setTimeout(this.recalcIframeHeight, 250);
  };

  renderAutoStart() {
    const { autoStart, opened, autoStartStyle, canUseChat, agentsAvailable } = this.props;

    if (cache.getValue('app.proactiveWindowClosed', false) ||
      opened ||
      !autoStart ||
      !canUseChat ||
      Object.keys(agentsAvailable).length < 1
    ) {
      return null;
    }

    return (
      <div
        ref={this.autoStartShellRef}
      >
        <AutoStart
          onClose={this.onProactiveClose}
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
      iframeStyle.width  = '400px';
    }
    return (
      <Frame
        style={{ ...iframeStyle, ...style }}
      >
        <div className={classNames('dpmsg-TriggerBtn-wrapper', autoStartStyle, themeVars.position)}>
          {this.state.canRenderAutoStart && this.renderAutoStart()}
          <button
            style={{
              background: this.props.themeVars['--color-primary'],
              border:     `1px solid ${this.props.themeVars['--color-primary']}`
            }}
            className={classNames(`dpmsg-TriggerBtn color--primary`)}
            onClick={this.handleTogglerClick}
          >
            {opened ? (
              <i className="dpmsg-Icon dpmsg-IconClose"/>
            ) : (
              <i className="dpmsg-Icon dpmsg-IconChat"/>
            )}
          </button>
        </div>
      </Frame>
    );
  }
}

const WidgetTogglerWithStyles = (props) => (
  <ConfigConsumer>
    {({ themeVars, autoStart, autoStartTimeout, autoStartStyle }) =>
      <WidgetToggler
        themeVars={themeVars}
        autoStart={autoStart}
        autoStartTimeout={autoStartTimeout}
        autoStartStyle={autoStartStyle}
        {...props}
      />}
  </ConfigConsumer>
);

const mapStateToProps = (state) => ({
  opened:          isWindowOpened(state),
  agentsAvailable: getAgentsAvailable(state),
  canUseChat:      canUseChat(state),
});

export default connect(
  mapStateToProps,
  { toggleWindow, openWindowOnce, proactiveWindowClosed }
)(WidgetTogglerWithStyles);
