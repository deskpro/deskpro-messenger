import React, { Fragment, PureComponent, createRef, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Frame from './Frame';
import { withConfig } from './ConfigContext';
import ScreenRoute from './ScreenRoute';
import MessengerShell from './MessengerShell';
import MuteButton from '../../containers/MuteButton';
import BackButton from '../../containers/BackButton';
import { isWindowOpened } from '../../modules/app';
import { withFrameContext } from '../core/Frame';

const iframeStyle = {
  bottom: 'calc(60px + 20px)',
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

const getHeight = (height) => {
  const maxHeight = Math.ceil(Math.min(1000, window.parent.innerHeight * 0.9));
  /// wooooooo, magic numbers!
  return { height: Math.ceil(height + 132 > maxHeight ? maxHeight : height + 132), maxHeight };
};

class MessengerWindow extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool
  };
  state = {
    imageVisible: false,
    articleVisible: false,
    iframeHeight: '350px',
    maxHeight: 0
  };

  shellRef = createRef();

  recalcIframeHeight = (force = false) => {
    if (!this.shellRef.current || !this.shellRef.current.getBoundingClientRect) {
      return;
    }
    const { height, maxHeight } = getHeight(this.shellRef.current.getBoundingClientRect().height);

    if (height > parseInt(this.state.iframeHeight, 10)
      || maxHeight !== this.state.maxHeight || force) {
      this.setState({ iframeHeight: `${height}px`, maxHeight });
    }
  };

  onResize = (_, h) => {
    const { height } = getHeight(h);

     if(height >= parseInt(this.state.iframeHeight, 10) ) {
      this.setState({ iframeHeight: `${height}px` });
     }
  };

  componentDidUpdate(prevProps) {
    if(prevProps.opened !== this.props.opened && this.props.opened) {
      this.recalcIframeHeight(true);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }



  render() {
    const { opened, frameContext } = this.props;

    return (
      <Frame
        head={extraStyles}
        hidden={!opened}
        style={{
          ...iframeStyle,
          height: this.state.iframeHeight
        }}
      >
        <MessengerShell
          ref={this.shellRef}
          onResize={this.onResize}
        >
          <div>
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
          </div>
        </MessengerShell>
      </Frame>
    );
  }
}

export default withFrameContext(withConfig(
  injectIntl(
    connect((state) => ({ opened: isWindowOpened(state) }))(MessengerWindow)
  ))
);
