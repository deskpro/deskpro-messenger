import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/* Heigh of the toggle button, its margins, and margins of the widget shell */
const OUTER_ELEMENTS_HEIGHT = 102;
/* Height of the widget header, footer and margins  */
const INNER_ELEMENTS_HEIGHT = 185;

const getWidgetContentMaxHeight = () =>
  window.parent.innerHeight - OUTER_ELEMENTS_HEIGHT - INNER_ELEMENTS_HEIGHT;

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
      controls,
      forwardedRef
    } = this.props;

    return (
      <div className="dpmsg-ScreenWrap" ref={forwardedRef}>
        <div
          className={classNames('dpmsg-Screen', {
            'is-minimal': isMinimal,
            'is-blue': theme === 'blue',
            'is-light': theme === 'light'
          })}
          style={{ height: 'auto' }}
        >
          <div className="dpmsg-ScreenHeder">
            <div className="dpmsg-ScreenControls dpmsg-Level">{controls}</div>
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
          <div
            className="dpmsg-ScreenContent"
            style={{
              maxHeight: `${getWidgetContentMaxHeight()}px`
            }}
          >
            {children}
          </div>
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

export default forwardRef((props, ref) => (
  <MessengerShell {...props} forwardedRef={ref} />
));
