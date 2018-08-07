import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class MessengerShell extends PureComponent {
  static propTypes = {
    isMinimal: PropTypes.bool,
    theme: PropTypes.oneOf(['blue', 'light']),
    title: PropTypes.string,
    introText: PropTypes.string,
    children: PropTypes.any,
    controls: PropTypes.any
  };

  static defaultProps = {
    isMinimal: true,
    theme: 'blue',
    title: 'Get in touch',
    introText: ''
  };

  render() {
    const {
      isMinimal,
      theme,
      title,
      introText,
      children,
      controls
    } = this.props;

    return (
      <div className="dpmsg-ScreenWrap">
        <div
          className={classNames('dpmsg-Screen', {
            'is-minimal': isMinimal,
            'is-blue': theme === 'blue',
            'is-light': theme === 'light'
          })}
          style={{ height: 'calc(100vh - 15px)' }}
        >
          <div className="dpmsg-ScreenHeder">
            {controls}
            <div className="dpmsg-ScreenHederLogo">
              <img
                src="https://deskpro.github.io/messenger-style/img/dp-logo-white.svg"
                alt=""
              />
            </div>
            <span className="dpmsg-ScreenHederTitle">{title}</span>
            {!!introText && (
              <span className="dpmsg-ScreenHederText">{introText}</span>
            )}
          </div>
          {children}
          <div className="dpmsg-ScreenFooter">
            <span className="dpmsg-ScreenLine" />
            <span className="dpmsg-ScreenFooterText">Powered by</span>
            <span className="dpmsg-VertLine" />
            <img
              className="dpmsg-ScreenFooterLogo"
              src="https://deskpro.github.io/messenger-style/img/deskpro-logo.svg"
              alt=""
            />
            <span className="dpmsg-ScreenLine" />
          </div>
        </div>
      </div>
    );
  }
}

export default MessengerShell;
