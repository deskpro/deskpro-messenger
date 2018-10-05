import React, { Fragment, PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Frame from './Frame';
import { withConfig } from './ConfigContext';
import ScreenRoute from './ScreenRoute';
import MessengerShell from './MessengerShell';
import MuteButton from '../../containers/MuteButton';
import BackButton from '../../containers/BackButton';
// import RandomImageFrame from '../poc/ImageFrame';
// import LoremIpsumFrame from '../poc/ArticleFrame';

/*const windowStyle = {
  height: '300px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};*/

const iframeStyle = {
  bottom: 'calc(60px + 14px + 14px)',
  width: '400px',
  maxHeight: 'calc(100vh - 60px - 14px - 14px - 14px)',
  minHeight: '350px'
};

const transMessages = {
  title: {
    id: 'app.title',
    defaultMessage: 'Get in Touch'
  }
};

class MessengerWindow extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool
  };
  state = {
    imageVisible: false,
    articleVisible: false,
    iframeHeight: '100%'
  };

  shellRef = createRef();

  recalcIframeHeight = () => {
    if (!this.shellRef.current) {
      return;
    }
    const rect = this.shellRef.current.getBoundingClientRect();
    const height = `${rect.height + 15}px`;
    if (height !== this.state.iframeHeight) {
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

  toggleImageFrame = () =>
    this.setState({ imageVisible: !this.state.imageVisible });

  toggleLoremIpsum = () =>
    this.setState({ articleVisible: !this.state.articleVisible });

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
    const { opened, intl } = this.props;

    return (
      <Frame
        style={{
          ...iframeStyle,
          height: this.state.iframeHeight,
          display: opened ? 'block' : 'none'
        }}
      >
        <MessengerShell
          controls={this.renderToolbar()}
          ref={this.shellRef}
          title={intl.formatMessage(transMessages.title)}
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
                <Redirect key="index-redirect" to="/screens/index" />
              ])}
          </Switch>
          {/*<div className="dpmsg-Block">
            <button onClick={this.toggleImageFrame}>Show Random Image</button>
            <br />
            <button onClick={this.toggleLoremIpsum}>Show Lorem Ipsum</button>
            {this.state.imageVisible && <RandomImageFrame />}
            {this.state.articleVisible && <LoremIpsumFrame />}
              </div>*/}
        </MessengerShell>
      </Frame>
    );
  }
}

export default withConfig(injectIntl(MessengerWindow));
