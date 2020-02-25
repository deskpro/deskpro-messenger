import React, { forwardRef, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import { ConfigConsumer } from './ConfigContext';
import ScreenContent from './ScreenContent';
import { isLightColor } from '../../utils/color';
import BackButton from '../../containers/BackButton';
import MuteButton from '../../containers/MuteButton';
import { Footer } from '../ui/Footer';

class MessengerShell extends PureComponent {
  static propTypes = {
    isMinimal: PropTypes.bool,
    isLight: PropTypes.bool,
    children: PropTypes.any,
    screens: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isMinimal: true,
    isLight: false,
    title: 'Get in touch',
  };

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
              <button className='dpmsg-AutoStart-close' onClick={this.props.onClose}/>
            </Fragment>
          );
        }}
      </Route>
    );
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
          <div className="dpmsg-Control">
            <div className="dpmsg-ScreenControls dpmsg-Level">
              { this.renderToolbar() }
            </div>
          </div>
          <ScreenContent ref={forwardedRef}>
            {children}
            <Footer />
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
