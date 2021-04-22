import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';
import { injectIntl } from 'react-intl';
import asset from '../../utils/asset';
import { withConfig } from '../core/ConfigContext';

class Header extends PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    themeVars: PropTypes.object.isRequired
  }

  static defaultProps = {
    icon: ''
  }

  render() {
    const { intl, icon, themeVars } = this.props;

    const headerImage = icon || (themeVars.copyfree ? null : asset('img/dp-logo-white.svg'));

    return (
      <div className={classNames("dpmsg-ScreenHeader", { 'dpmsg-ScreenHeader-noLogo': !headerImage })}>
        {headerImage && <div className="dpmsg-ScreenHeaderLogo">
          {
            headerImage.substr(-3) === 'svg'
              ? <Isvg src={headerImage} alt=""/>
              : <img src={headerImage} alt=""/>
          }
        </div>}
        <span className="dpmsg-ScreenHeaderTitle">{intl.formatMessage({ id: 'helpcenter.messenger.greeting' })}</span>
      </div>
    )
  }
}

export default injectIntl(withConfig(Header));
