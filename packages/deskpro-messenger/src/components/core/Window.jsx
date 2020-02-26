import React, { createRef, Fragment, PureComponent, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Frame from './Frame';
import { withConfig } from './ConfigContext';
import ScreenRoute from './ScreenRoute';
import MessengerShell from './MessengerShell';
import { isWindowOpened, setWindowState } from '../../modules/app';
import { withFrameContext } from '../core/Frame';
import AnimateHeight from 'react-animate-height';

const iframeStyle = {
  bottom: '90px',
  width: '400px',
  maxHeight: 'calc(90vh - 60px - 20px)',
  minHeight: '350px'
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
    opened: PropTypes.bool
  };
  state = {
    imageVisible: false,
    articleVisible: false,
    iframeHeight: 450,
    contentHeight: 416,
    maxHeight: '1000px'
  };

  shellRef = createRef();

  getHeight = (height) => {
    const maxHeight = Math.ceil(Math.min(1000, this.props.frameContext.window.parent.innerHeight * 0.9));
    /// wooooooo, magic numbers!
    return { height: Math.ceil(height + 67 > maxHeight ? maxHeight : height + 67), maxHeight };
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
        style={{
          ...iframeStyle,
          height: `${iframeHeight}px`,
          maxHeight: maxHeight
        }}
      >
        <AnimateHeight
          duration={500}
          height={iframeHeight}
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
