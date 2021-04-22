import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Isvg from 'react-inlinesvg';
import { ConfigConsumer } from './ConfigContext';
import asset from '../../utils/asset';
import { isLightColor } from '../../utils/color';

class AutoStartShell extends PureComponent {
  static propTypes = {
    isMinimal:  PropTypes.bool,
    isLight:    PropTypes.bool,
    title:      PropTypes.string,
    introText:  PropTypes.string,
    children:   PropTypes.any,
    controls:   PropTypes.any,
    icon:       PropTypes.string,
    isCopyfree: PropTypes.bool
  };

  static defaultProps = {
    isMinimal:  true,
    isLight:    false,
    title:      'Get in touch',
    introText:  '',
    icon:       '',
    isCopyfree: false
  };

  render() {
    const {
            isLight,
            title,
            introText,
            children,
            controls,
            forwardedRef,
            icon,
            isCopyfree
          } = this.props;

    const headerImage = icon || (isCopyfree ? null : asset('img/dp-logo-white.svg'));

    return (
      <div className="dpmsg-ScreenWrap" ref={forwardedRef} style={{ marginBottom: '20px', display: 'none' }}>
        <div className={classNames('dpmsg-Screen', { 'is-light': isLight })}>
          <div
            className={classNames("dpmsg-AutoStartHeader dpmsg-ScreenHeader", { 'dpmsg-ScreenHeader-noLogo': !headerImage })}>
            <div className="dpmsg-ScreenControls dpmsg-Level">{controls}</div>
            {headerImage && <div className="dpmsg-ScreenHeaderLogo">
              {
                headerImage.substr(-3) === 'svg'
                  ? <Isvg src={headerImage} alt=""/>
                  : <img src={headerImage} alt=""/>
              }
            </div>}
            <span className="dpmsg-ScreenHeaderTitle">{title}</span>
            {!!introText && (
              <span className="dpmsg-ScreenHeaderText">{introText}</span>
            )}
          </div>
          <div className="dpmsg-ScreenContent">
            <div className="dpmsg-ScreenContentWrapper">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default forwardRef((props, ref) => (
  <ConfigConsumer>
    {({ themeVars }) => (
      <AutoStartShell
        {...props}
        forwardedRef={ref}
        isCopyfree={themeVars.copyfree}
        isLight={
          !!themeVars['--color-primary'] &&
          isLightColor(themeVars['--color-primary'])
        }
      />
    )}
  </ConfigConsumer>
));
