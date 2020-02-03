import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { canUseChat, getAgentsAvailable } from "../../modules/info";
import { getUser } from '../../modules/guest';
import { createChat } from '../../modules/chat';
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
    chatSettings:          PropTypes.object,
    chatEnabled:           PropTypes.bool.isRequired,
    autoStart:             PropTypes.bool,
    autoStartTimeout:      PropTypes.number,
    autoStartStyle:        PropTypes.string,
    screens:               PropTypes.object,
    user:                  PropTypes.object,
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

  static defaultProps = {
    chatSettings: {}
  };

  state            = {
    iframeHeight:       '60px',
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
    const { chatEnabled, autoStart, autoStartTimeout } = this.props;

    if (chatEnabled && autoStart) {
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
    setTimeout(this.recalcIframeHeight, 250);
  };

  startChat = (message = '') => {
    if(message) {
      this.sendCreateChat(message);
    } else {
      this.props.history.push(`/screens/startChat`);
      this.props.toggleWindow();
    }

    this.props.proactiveWindowClosed();

    setTimeout(this.recalcIframeHeight, 250);
  };

  canAutoStart = () => {
    const { autoStart, opened, canUseChat, agentsAvailable, chatEnabled } = this.props;

    return !(
      !chatEnabled ||
      cache.getValue('app.proactiveWindowClosed', false) ||
      opened ||
      !autoStart ||
      !canUseChat ||
      Object.keys(agentsAvailable).length < 1
    );

  };

  sendCreateChat = (message) => {
    const { createChat, chatSettings: { department }, user } = this.props;
    const values = { chat_department: department, name: user.name, email: user.email };
    const meta = {
      message: {
        origin: 'user',
        type: 'chat.message',
        ...{ message }
      }
    };

    createChat(values, {
      fromScreen: 'startChat',
      name: user.name,
      email: user.email,
      ...meta
    });
  };


  renderAutoStart() {
    const { autoStartStyle, screens } = this.props;

    if (!this.canAutoStart()) {
      return null;
    }

    return (
      <div
        ref={this.autoStartShellRef}
      >
        <AutoStart
          onClose={this.onProactiveClose}
          autoStartStyle={autoStartStyle}
          screens={screens}
          startChat={this.startChat}
        />
      </div>
    );
  }

  render() {
    const { opened, themeVars, autoStartStyle } = this.props;

    const style = {
      [themeVars.position === 'left' ? 'left' : 'right']: '14px'
    };

    if (this.canAutoStart()) {
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
    {({ themeVars, autoStart, autoStartTimeout, autoStartStyle, screens }) =>
      <WidgetToggler
        chatEnabled={!!screens.startChat}
        chatSettings={screens.startChat}
        themeVars={themeVars}
        autoStart={autoStart}
        autoStartTimeout={autoStartTimeout}
        autoStartStyle={autoStartStyle}
        screens={screens}
        {...props}
      />}
  </ConfigConsumer>
);

const mapStateToProps = (state) => ({
  opened:          isWindowOpened(state),
  agentsAvailable: getAgentsAvailable(state),
  canUseChat:      canUseChat(state),
  user:            getUser(state),
});

export default connect(
  mapStateToProps,
  { toggleWindow, openWindowOnce, proactiveWindowClosed, createChat }
)(WidgetTogglerWithStyles);
