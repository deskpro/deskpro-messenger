import React, { Fragment, PureComponent } from 'react';
import asset from '../../utils/asset';
import Isvg from 'react-inlinesvg';
import { withConfig } from '../core/ConfigContext';
import { Route } from 'react-router-dom';
import BackButton from '../../containers/BackButton';
import MuteButton from '../../containers/MuteButton';

const headerImage = 'img/dp-logo-white.svg';

class Header extends PureComponent {

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
    const { widget: { greetingTitle }} = this.props;

    return (
      <div className="dpmsg-ScreenHeader">
        <div className="dpmsg-ScreenControls dpmsg-Level">{this.renderToolbar()}</div>
        <div className="dpmsg-ScreenHeaderLogo">
          {
            headerImage.substr(-3) === 'svg'
              ? <Isvg src={asset(headerImage)} alt="" />
              : <img src={asset(headerImage)} alt="" />
          }
        </div>
        <span className="dpmsg-ScreenHeaderTitle">{greetingTitle}</span>
      </div>
    )
  }
}

export default withConfig(Header);
