import React, { createRef, Fragment, PureComponent, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import isMobile from 'is-mobile';
import Frame from './Frame';
import { ConfigConsumer, withConfig } from './ConfigContext';
import ScreenRoute from './ScreenRoute';
import MessengerShell from './MessengerShell';
import { isWindowOpened, setWindowState } from '../../modules/app';
import { canUseKb, canUseChat, canUseTickets, getAgentsAvailable } from '../../modules/info';
import { withFrameContext } from './Frame';
import AnimateHeight from 'react-animate-height';
import { compose } from 'redux';

const mobile = isMobile();

const iframeStyle = {
  bottom: mobile ? '0' : '70px',
  width: mobile ? '100%' : '440px',
  maxHeight: mobile ? 'calc(100vh)' : 'calc(90vh - 50px)',
  minHeight: mobile ? '200px' : '350px',
};

const extraStyles = (
  <Fragment>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.9.0/css/froala_editor.pkgd.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.9.0/css/froala_style.min.css"
    />
  </Fragment>
);

const transMessages = {
  loading: {
    id: 'helpcenter.messenger.loading',
    defaultMessage: 'Loading',
  },
}


class MessengerWindow extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    agentsAvailable: PropTypes.object,
    chatAvailable: PropTypes.bool,
    kbAvailable: PropTypes.bool,
    ticketsAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    kbEnabled: PropTypes.bool,
    ticketsEnabled: PropTypes.bool
  };
  state = {
    animating: false,
    imageVisible: false,
    articleVisible: false,
    iframeHeight: mobile ? '100%' : 455,
    contentHeight: 416,
    maxHeight: mobile ? '100%' : '1000px'
  };

  shellRef = createRef();

  getHeight = (height) => {
    const maxHeight = mobile
      ? this.props.frameContext.window.top.innerHeight
      : Math.ceil(Math.min(1060, (this.props.frameContext.window.top.innerHeight  - 52) * 0.9));

    let iframeHeight;
    if(this.isIndex() && !mobile) {
      iframeHeight = Math.ceil(height +  125 > maxHeight ? maxHeight : height +  125);
    } else {
      iframeHeight = maxHeight;
    }

    return { height: iframeHeight, maxHeight };
  };

  isIndex = () => {
    return this.props.location.pathname.indexOf('index') !== -1;
  };

  recalcIframeHeight = (force = false) => {
    if (!this.shellRef.current || !this.shellRef.current.getBoundingClientRect) {
      return;
    }

    const ref = this.shellRef.current;
    const rect = ref.getBoundingClientRect();
    const { height, maxHeight } = this.getHeight(rect.height);

    const stateToSet = { contentHeight: rect.height };

    if ((height > this.state.iframeHeight)
      || maxHeight !== parseInt(this.state.maxHeight, 10) || force) {
      stateToSet.maxHeight = `${maxHeight}px`;
      stateToSet.iframeHeight = height;
    }
    this.setState( stateToSet );
  };

  onClose = () => {
    this.props.setWindowState(false);
  };

  componentDidMount() {
    this.recalcIframeHeight(true);
    this.interval = setInterval(this.recalcIframeHeight, 250);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.opened !== this.props.opened) {
      this.recalcIframeHeight(true);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { chatAvailable, kbAvailable, ticketsAvailable, agentsAvailable } = this.props;
    const { chatEnabled, kbEnabled, ticketsEnabled } = this.props;
    const { opened, frameContext, screens } = this.props;
    const { maxHeight, contentHeight, iframeHeight, animating } = this.state;
    if (
      (!chatAvailable || !chatEnabled || Object.keys(agentsAvailable).length < 1)
      && (!kbAvailable || !kbEnabled)
      && (!ticketsAvailable || !ticketsEnabled)
    ) {
      return null;
    }

    return (
      <Frame
        head={extraStyles}
        hidden={!opened}
        mobile={mobile}
        className="dpmsg-MessengerFrame"
        style={{
          ...iframeStyle,
          height: `${iframeHeight}px`,
          maxHeight: maxHeight
        }}
      >
        <AnimateHeight
          duration={500}
          height={mobile ? '100%' : (iframeHeight - 48) > 0 ? (iframeHeight - 48) : 'auto' }
          className="dpmsg-AnimationDiv"
          style={{width: mobile ? '100%' : '380px'}}
          onAnimationStart={() => this.setState({animating: true})}
          onAnimationEnd={() => this.setState({animating: false})}
        >
          <MessengerShell
            ref={this.shellRef}
            onClose={this.onClose}
            screens={screens}
            maxHeight={parseInt(maxHeight, 10)}
            iframeHeight={iframeHeight}
            contentHeight={contentHeight}
            mobile={mobile}
            opened={opened}
            animating={animating}
          >
            <Suspense
              fallback={
                <div className="dpmsg-Block">
                  <p><FormattedMessage {...transMessages.loading} />...</p>
                </div>
              }
            >
              <Switch>
                {Object.entries(this.props.screens)
                  .map(([screenName, screen]) => (
                    <ScreenRoute
                      frameContext={frameContext}
                      key={screenName}
                      path={`/screens/${screenName}`}
                      screen={screen}
                      screenName={screenName}
                    />
                  ))
                  .concat([
                    <ScreenRoute
                      frameContext={frameContext}
                      key="chatScreen"
                      path="/screens/active-chat/:chatId"
                      screenName="chatScreen"
                      screen={{ screenType: 'ChatScreen' }}
                    />,
                    <ScreenRoute
                      frameContext={frameContext}
                      key="quickSearchScreen"
                      path="/screens/search"
                      screenName="quickSearchScreen"
                      screen={{ screenType: 'QuickSearchScreen' }}
                    />,
                    <Redirect key="index-redirect" to="/screens/index" />
                  ])}
              </Switch>
            </Suspense>
          </MessengerShell>
        </AnimateHeight>
      </Frame>
    );
  }
}

const mapStateToProps = (state) => ({
  agentsAvailable:  getAgentsAvailable(state),
  opened:           isWindowOpened(state),
  chatAvailable:    canUseChat(state),
  kbAvailable:      canUseKb(state),
  ticketsAvailable: canUseTickets(state)
});

const MessengerWindowWithConfig = (props) => (
  <ConfigConsumer>
    {({ kbEnabled, chatEnabled, ticketsEnabled }) =>
      <MessengerWindow
        chatEnabled={chatEnabled}
        ticketsEnabled={ticketsEnabled}
        kbEnabled={kbEnabled}
        {...props}
      />}
  </ConfigConsumer>
);

export default compose(
  withFrameContext,
  withConfig,
  withRouter,
  injectIntl,
  connect(mapStateToProps, { setWindowState })
)(MessengerWindowWithConfig);
