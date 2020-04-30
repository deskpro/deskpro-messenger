import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import asset from '../../utils/asset';
import Isvg from 'react-inlinesvg';
import { withConfig } from '../core/ConfigContext';
import { injectIntl } from 'react-intl';

class Header extends PureComponent {

  static propTypes = {
    icon: PropTypes.string
  }

  static defaultProps = {
    icon: ''
  }

  render() {
    const { intl, icon } = this.props;

    const headerImage = icon || asset('img/dp-logo-white.svg');

    return (
      <div className="dpmsg-ScreenHeader">
        <div className="dpmsg-ScreenHeaderLogo">
          {
            headerImage.substr(-3) === 'svg'
              ? <Isvg src={headerImage} alt="" />
              : <img src={headerImage} alt="" />
          }
        </div>
        <span className="dpmsg-ScreenHeaderTitle">{intl.formatMessage({id: 'helpcenter.messenger.greeting'})}</span>
      </div>
    )
  }
}

export default injectIntl(withConfig(Header));
