import React, { PureComponent } from 'react';
import asset from '../../utils/asset';
import Isvg from 'react-inlinesvg';
import { withConfig } from '../core/ConfigContext';

const headerImage = 'img/dp-logo-white.svg';

class Header extends PureComponent {

  render() {
    const { widget: { greetingTitle }} = this.props;

    return (
      <div className="dpmsg-ScreenHeader">
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