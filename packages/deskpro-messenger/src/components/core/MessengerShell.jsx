import React, { forwardRef, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import { ConfigConsumer } from './ConfigContext';
import ScreenContent from './ScreenContent';
import { isLightColor } from '../../utils/color';
import BackButton from '../../containers/BackButton';
import EndChatButton from '../../containers/EndChatButton';
import { connect } from 'react-redux';
import { getChatData } from '../../modules/chat';

class MessengerShell extends PureComponent {
  static propTypes = {
    isMinimal: PropTypes.bool,
    isLight: PropTypes.bool,
    iframeHeight: PropTypes.number,
    maxHeight: PropTypes.string,
    children: PropTypes.any,
    screens: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    mobile: PropTypes.bool
  };

  static defaultProps = {
    isMinimal: true,
    isLight: false,
    title: 'Get in touch',
    iframeHeight: 0,
    maxHeight: 0,
  };

  renderToolbar = () => {
    const { chatData } = this.props;

    return (
      <Route path="/screens/:screenName">
        {({ match }) => {
          const { screenName } = match.params;
          const isActiveChat = screenName === 'active-chat' && chatData && chatData.id && chatData.status !== 'ended';
          const screen = this.props.screens[screenName];
          return (
            <Fragment>
              {screenName !== 'index' && (
                <BackButton screen={screen} screenName={screenName} />
              )}
              {isActiveChat && <EndChatButton />}
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
      iframeHeight,
      contentHeight,
      maxHeight,
      forwardedRef,
      mobile
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
          <ScreenContent
            maxHeight={maxHeight}
            contentHeight={contentHeight}
            ref={forwardedRef}
            iframeHeight={iframeHeight}
            mobile={mobile}
            animating={this.props.animating}
          >
            {children}
          </ScreenContent>
        </div>
      </div>
    );
  }
}

const MessengerShellConnected = connect(
  (state) => ({chatData:getChatData(state)})
)(MessengerShell);

export default forwardRef((props, ref) => (
  <ConfigConsumer>
    {({ themeVars }) => (
      <MessengerShellConnected
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
