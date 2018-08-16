import React, { PureComponent, createRef } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import Frame from './Frame';
import { withConfig } from './ConfigContext';
import ScreenRoute from './ScreenRoute';
import MessengerShell from './MessengerShell';
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

class MessengerWindow extends PureComponent {
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

  renderBackButton = () => {
    return (
      <Route>
        {({ location, history }) =>
          location.pathname !== '/screens/index' && (
            <div className="dpmsg-ScreenControls dpmsg-Level">
              <Link
                to={`#`}
                className="dpmsg-BackBtn dpmsg-LevelLeft"
                onClick={e => {
                  e.preventDefault();
                  history.goBack();
                }}
              >
                <i className="dpmsg-IconArrow iconArrow--left" /> back
              </Link>
            </div>
          )
        }
      </Route>
    );
  };

  render() {
    return (
      <Frame style={{ ...iframeStyle, height: this.state.iframeHeight }}>
        <MessengerShell controls={this.renderBackButton()} ref={this.shellRef}>
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
              .concat([<Redirect key="index-redirect" to="/screens/index" />])}
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

export default withConfig(MessengerWindow);
