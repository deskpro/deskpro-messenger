import React, { PureComponent } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import Frame from './Frame';
import { withConfig } from './ConfigContext';
import ScreenRoute from './ScreenRoute';
import MessengerShell from './MessengerShell';
import RandomImageFrame from '../poc/ImageFrame';
import LoremIpsumFrame from '../poc/ArticleFrame';

/*const windowStyle = {
  height: '300px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};*/

const iframeStyle = {
  bottom: '104px',
  width: '400px',
  height: '400px'
};

class MessengerWindow extends PureComponent {
  state = {
    imageVisible: false,
    articleVisible: false
  };

  toggleImageFrame = () =>
    this.setState({ imageVisible: !this.state.imageVisible });

  toggleLoremIpsum = () =>
    this.setState({ articleVisible: !this.state.articleVisible });

  renderBackButton = () => {
    return (
      <Route>
        {({ location, history }) =>
          location.pathname !== '/screens/index' && (
            <div className="dpmsg-ScreenControls dp-Level">
              <Link
                to={`#`}
                className="dpmsg-BackBtn dp-LevelLeft"
                onClick={e => {
                  e.preventDefault();
                  history.goBack();
                }}
              >
                <i className="dp-IconArrow iconArrow--left" /> back
              </Link>
            </div>
          )
        }
      </Route>
    );
  };

  render() {
    return (
      <Frame style={iframeStyle}>
        <MessengerShell controls={this.renderBackButton()}>
          <div className="dpmsg-Block">
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
                  <Redirect key="index-redirect" to="/screens/index" />
                ])}
            </Switch>
          </div>
          <div className="dpmsg-Block">
            <button onClick={this.toggleImageFrame}>Show Random Image</button>
            <br />
            <button onClick={this.toggleLoremIpsum}>Show Lorem Ipsum</button>
            {this.state.imageVisible && <RandomImageFrame />}
            {this.state.articleVisible && <LoremIpsumFrame />}
          </div>
        </MessengerShell>
      </Frame>
    );
  }
}

export default withConfig(MessengerWindow);
