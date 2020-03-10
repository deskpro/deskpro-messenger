import React, { createRef, Fragment, PureComponent, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import isMobile from 'is-mobile';
import Frame from './Frame';
import { withConfig } from './ConfigContext';
import ScreenRoute from './ScreenRoute';
import MessengerShell from './MessengerShell';
import { isWindowOpened, setWindowState } from '../../modules/app';
import { withFrameContext } from '../core/Frame';
import AnimateHeight from 'react-animate-height';

const mobile = isMobile();

const iframeStyle = {
  bottom: mobile ? '0' : '90px',
  width: mobile ? '100%' : '400px',
  maxHeight: mobile ? 'calc(100vh)' : 'calc(90vh - 90px)',
  minHeight: mobile ? '200px' : '350px',
  boxShadow: '5px 0 20px rgba(29,62,85,0.3)',
  borderRadius: '4px'
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



class MessengerWindow extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    formFocused: PropTypes.bool,

  };
  state = {
    imageVisible: false,
    articleVisible: false,
    iframeHeight: mobile ? '100%' : 455,
    contentHeight: 416,
    maxHeight: mobile ? '100%' : '1000px'
  };

  shellRef = createRef();

  getHeight = (height) => {
    const { formFocused } = this.props;
    const maxHeight = mobile
      ? this.props.frameContext.window.parent.innerHeight
      : Math.ceil(Math.min(1000, this.props.frameContext.window.parent.innerHeight * 0.9 - 90)) + 5;

    let iframeHeight;
    if(!mobile) {
      iframeHeight = Math.ceil(height + (formFocused && mobile ? 34 : 67) > maxHeight ? maxHeight : height + (formFocused && mobile ? 34 : 67));
    } else {
      iframeHeight = maxHeight;
    }


    return { height: iframeHeight, maxHeight };
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
    this.setState( stateToSet);
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
    const { opened, frameContext } = this.props;
    const { maxHeight, contentHeight, iframeHeight } = this.state;

    return (
      <Frame
        head={extraStyles}
        hidden={!opened}
        mobile={mobile}
        style={{
          ...iframeStyle,
          height: `${iframeHeight}px`,
          maxHeight: maxHeight
        }}
      >
        <AnimateHeight
          duration={500}
          height={mobile ? '100%' : iframeHeight}
          className="dpmsg-AnimationDiv"
          style={{display: 'flex', alignItems: 'flex-end'}}
        >
          <MessengerShell
            ref={this.shellRef}
            onClose={this.onClose}
            screens={this.props.screens}
            maxHeight={maxHeight}
            iframeHeight={iframeHeight}
            contentHeight={contentHeight}
            mobile={mobile}
            opened={opened}
          >
            <Suspense
              fallback={
                <div className="dpmsg-Block">
                  <p>Loading...</p>
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

export default withFrameContext(withConfig(
  injectIntl(
    connect((state) => ({ opened: isWindowOpened(state) }), { setWindowState })(MessengerWindow)
  ))
);
