import React, { createRef, forwardRef, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import { FrameContextConsumer } from 'react-frame-component';
import ScrollArea from 'react-scrollbar/dist/no-css';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isMobile from 'is-mobile';

import { isMessageFormFocused } from '../../modules/app';
import { getChatData, sendMessage } from '../../modules/chat';
import { Footer } from '../ui/Footer';
import MessageForm from '../chat/MessageForm';

const mobile = isMobile();
export const ScreenContentContext = React.createContext();

class ScreenContent extends PureComponent {

  static propTypes = {
    frameContext: PropTypes.object,
    iframeHeight: PropTypes.number.isRequired,
    mobile:       PropTypes.bool.isRequired,
    formFocused:  PropTypes.bool
  };

  static defaultProps = {
    frameContext: {},
    formFocused: false
  };

  scrollArea = createRef();

  componentDidUpdate(prevProps) {
    if (
      this.props.location !== prevProps.location ||
      (!this.props.animating && prevProps.animating)
    ) {
      this.scrollArea.current.scrollArea.refresh();
      this.scrollArea.current.scrollTop();
    }
  }

  scrollToBottom() {

    setTimeout(() => {
      if (this.scrollArea.current) {
        this.scrollArea.current.setState(
          {containerHeight: this.scrollArea.current.wrapper.offsetHeight},
          () => this.scrollArea.current.scrollBottom()
        );
      }
    }, 10);
  }

  isChat = () => {
    return this.props.location.pathname.indexOf('active-chat') !== -1;
  };

  handleSendMessage = (message, type = 'chat.message') => {
    if (message) {
      const messageModel = {
        origin: 'user',
        type: type,
        ...(typeof message === 'string' ? { message } : message)
      };
      this.props.sendMessage(messageModel, this.props.chatData);
    }
  };

  render() {
    const { children, contentHeight, iframeHeight, maxHeight, frameContext, forwardedRef, formFocused } = this.props;

    const fullHeight = iframeHeight > parseInt(contentHeight, 10) && this.scrollArea.current && this.scrollArea.current.state.realHeight < iframeHeight;
    let height = iframeHeight >= contentHeight ? iframeHeight - 34 : contentHeight + ((mobile && formFocused) || this.isChat() ? 0 : 33);
    if(this.isChat()) {
      height = parseInt(maxHeight, 10) - 157;
    }
    const { chatData } = this.props;

    return (
      <div
        className={classNames('dpmsg-ScreenContent', {'dpmsg-isChatScreenContent': this.isChat()})}

      >
        <ScrollArea
          horizontal={false}
          ref={this.scrollArea}
          className={classNames({ fullHeight })}
          contentStyle={{height, display: 'flex', flexDirection: 'column'}}
          stopScrollPropagation={true}
          contentWindow={frameContext.window}
          ownerDocument={frameContext.document}
        >
          <div ref={forwardedRef} className="dpmsg-ScreenContentWrapper" style={{height: this.isChat() ? height : undefined }}>
            <ReactResizeDetector handleHeight>
              {(width, height) => (
                <ScreenContentContext.Provider value={{
                    animating: this.props.animating,
                    width,
                    height,
                    maxHeight: parseInt(maxHeight, 10),
                    scrollArea: this.scrollArea
                  }}
                >
                  {children}
                </ScreenContentContext.Provider>
              )}
            </ReactResizeDetector>
          </div>
          { !this.isChat() && <Footer />}
        </ScrollArea>
        {this.isChat() &&
          <Fragment>
            {!!chatData && chatData.status !== 'ended' && (
              <MessageForm
                frameContext={frameContext}
                onSend={this.handleSendMessage}
                scrollMessages={() => this.scrollToBottom()}
                style={{ flex: '0 0 auto' }}
              />
            )}
            <Footer />
          </Fragment>
        }
      </div>
    );
  }
}

const ScreenContentWithRouter = compose(
  connect(
    (state) => ({
      formFocused: isMessageFormFocused(state),
      chatData:    getChatData(state)
    }),
    { sendMessage }
  ),
  withRouter
)(ScreenContent);

export default forwardRef((props, ref) => (
  <FrameContextConsumer>
    {(context) => (
      <ScreenContentWithRouter
        {...props}
        forwardedRef={ref}
        frameContext={context}
      />
    )}
  </FrameContextConsumer>
));

export const withScreenContentSize = (WrappedComponent) => (props) => (
  <ScreenContentContext.Consumer>
    {(context) => <WrappedComponent {...props} contentSize={context} />}
  </ScreenContentContext.Consumer>
);
