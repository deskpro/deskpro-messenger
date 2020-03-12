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
import { getChatData, sendMessage, createChat } from '../../modules/chat';
import { Footer } from '../ui/Footer';
import MessageForm from '../chat/MessageForm';
import { getUser } from '../../modules/guest';
import { getChatDepartments } from '../../modules/info';

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

  isChat = (strict = false) => {
    return this.props.location.pathname.indexOf('active-chat') !== -1 || (!strict && this.isStartChat());
  };

  isStartChat = () => {
    return this.props.location.pathname.indexOf('startChat') !== -1;
  };

  isChatEnded = () => {
    const { chatData } = this.props;
    return this.isChat(true) && !!chatData && chatData.status === 'ended';
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

  createChat = (values, meta = {}) => {
    const { createChat, user } = this.props;
    const postData = { fields: {} };
    for(const [key, value] of Object.entries(values)) {
      if(key.match(/^chat_field/)) {
        postData.fields[key.split('_').splice(-1, 1).join('')] = value;
      } else {
        postData[key] = value;
      }
    }
    createChat(postData, {
      fromScreen: 'startChat',
      name: user.name,
      email: user.email,
      ...meta
    });
  };

  onSendMessage = (message, type = 'chat.message') => {
    if (message && type === 'chat.message') {
      const { user, screens: { startChat: { department }} } = this.props;

      const messageModel = {
        origin: 'user',
        type: 'chat.message',
        ...(typeof message === 'string' ? { message } : message)
      };
      this.createChat({ chat_department: department, name: user.name, email: user.email }, { message: messageModel });
    }
  };

  render() {
    const { children, contentHeight, iframeHeight, maxHeight, frameContext, forwardedRef, formFocused } = this.props;

    const fullHeight = this.scrollArea.current && this.scrollArea.current.content.scrollHeight <= iframeHeight - (this.isChat() ? 171 : 67);
    const height = iframeHeight - (this.isChat() ? 171 : 67) >= contentHeight ? iframeHeight - (this.isChat() ? 171 : 34) : contentHeight + ((mobile && formFocused) || this.isChat() ? 0 : 33);

    const { chatData } = this.props;

    return (
      <div
        className={classNames(
          'dpmsg-ScreenContent',
          {'dpmsg-isChatScreenContent': this.isChat(), 'dpmsg-isChatEnded': this.isChatEnded()}
        )}
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
          <div ref={forwardedRef} className="dpmsg-ScreenContentWrapper" style={{height: fullHeight ? height : undefined}}>
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
            {(!this.isChatEnded() || this.isStartChat()) && (
              <MessageForm
                frameContext={frameContext}
                onSend={!!chatData ? this.handleSendMessage : this.onSendMessage}
                scrollMessages={() => !!chatData && this.scrollToBottom()}
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
    (state, props) => ({
      formFocused: isMessageFormFocused(state),
      chatData:    getChatData(state),
      user:        getUser(state),
      departments: getChatDepartments(state, props)
    }),
    { sendMessage, createChat }
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
