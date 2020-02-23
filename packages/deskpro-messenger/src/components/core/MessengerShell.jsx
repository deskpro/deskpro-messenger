import React, { forwardRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ConfigConsumer } from './ConfigContext';
import ScreenContent from './ScreenContent';
import { isLightColor } from '../../utils/color';

class MessengerShell extends PureComponent {
  static propTypes = {
    isMinimal: PropTypes.bool,
    isLight: PropTypes.bool,
    children: PropTypes.any,
  };

  static defaultProps = {
    isMinimal: true,
    isLight: false,
    title: 'Get in touch',
    introText: ''
  };

  render() {
    const {
      isMinimal,
      isLight,
      children,

      forwardedRef
    } = this.props;



    return (
      <div className="dpmsg-ScreenWrap" style={{ display: 'none' }}>
        <div
          className={classNames('dpmsg-Screen', {
            'is-minimal': isMinimal,
            'is-light': isLight
          })}
        >
          <ScreenContent ref={forwardedRef} onResize={this.props.onResize}>
            {children}
          </ScreenContent>
        </div>
      </div>
    );
  }
}

export default forwardRef((props, ref) => (
  <ConfigConsumer>
    {({ themeVars }) => (
      <MessengerShell
        {...props}
        forwardedRef={ref}
        isLight={
          !!themeVars['--color-primary'] &&
          isLightColor(themeVars['--color-primary'])
        }
      />
    )}
  </ConfigConsumer>
));
