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

const iframeStyle = {
  bottom: 'calc(60px + 14px + 14px)',
  width: '400px',
  maxHeight: 'calc(100vh - 60px - 14px - 14px - 14px)',
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
    iframeHeight: '350px'
  };

  shellRef = createRef();

  recalcIframeHeight = () => {
    if (!this.shellRef.current) {
      return;
    }
    const rect = this.shellRef.current.getBoundingClientRect();
    const maxHeight = Math.min(1000, window.parent.innerHeight * 0.9);
    const height = `${rect.height > maxHeight ? maxHeight : rect.height}px`;
    if (parseInt(height, 10) > parseInt(this.state.iframeHeight, 10)) {
      this.setState({ iframeHeight: height });
    }
  };

  componentDidMount() {
    // this.recalcIframeHeight();
    this.interval = setInterval(this.recalcIframeHeight, 250);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderToolbar = () => {
    return (
      <Route path="/screens/:screenName">
        {({ match }) => {
          const { screenName } = match.params;
          const screen = this.props.screens[screenName];
          return (
            <Fragment>
              {screenName !== 'index' && (
                <BackButton screen={screen} screenName={screenName} />
              )}
              {!!screen && screen.screenType === 'ChatScreen' && <MuteButton />}
            </Fragment>
          );
        }}
      </Route>
    );
  };

  render() {
    const { opened, widget: { greetingTitle } } = this.props;

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
          controls={this.renderToolbar()}
          ref={this.shellRef}
          title={greetingTitle}
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
                      key={screenName}
                      path={`/screens/${screenName}`}
                      screen={screen}
                      screenName={screenName}
                    />
                  ))
                  .concat([
                    <ScreenRoute
                      key="chatScreen"
                      path="/screens/active-chat/:chatId"
                      screenName="chatScreen"
                      screen={{ screenType: 'ChatScreen' }}
                    />,
                    <ScreenRoute
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

export default withConfig(
  injectIntl(
    connect((state) => ({ opened: isWindowOpened(state) }))(MessengerWindow)
  )
);
