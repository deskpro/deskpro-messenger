import React, { createRef, forwardRef, Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
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
import AJAXSubmit from "../../utils/AJAXSubmit";
import { withVisitorId } from "../../containers/withVisitorId";
import { ConfigContext, withConfig } from "../core/ConfigContext";
import DropArea from "../chat/DropArea";

const mobile = isMobile();
export const ScreenContentContext = React.createContext();


const HEADER_HEIGHT = 34;
const FOOTER_HEIGHT = 33;
const HEADER_FOOTER_HEIGHT = HEADER_HEIGHT + FOOTER_HEIGHT;

class ScreenContent extends PureComponent {

  static propTypes = {
    visitorId: PropTypes.string.isRequired,
    frameContext: PropTypes.object,
    iframeHeight: PropTypes.number.isRequired,
    mobile:       PropTypes.bool.isRequired,
    formFocused:  PropTypes.bool
  };

  static defaultProps = {
    frameContext: {},
    formFocused: false
  };

  static contextType = ConfigContext;

  constructor(props) {
    super(props);
    this.state = {
      formHeight: 90,
      progress: -1
    };
    this.scrollArea = createRef();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.location !== prevProps.location ||
      (!this.props.animating && prevProps.animating)
    ) {
      this.scrollArea.current.scrollArea.refresh();
      this.scrollArea.current.scrollTop();
    }
  }

  handleDrop = (accepted) => {
    if (accepted.length) {
      this.setState({ progress: 0 });
      accepted.forEach(file => this.handleFileSend(file));
    }
  };

  handleFileSend = (file) => {
    AJAXSubmit({
      url: `${this.context.helpdeskURL}/api/messenger/file/upload-file`,
      files: [file],
      name: 'blob',
      token: this.props.csrfToken,
      transferComplete: this.handleTransferComplete,
      transferFailed: this.handleTransferFailed,
      updateProgress: this.handleUpdateProgress,
      requestHeaders: {
        'X-DESKPRO-VISITORID': this.props.visitorId
      },
    });
  };

  handleTransferComplete = (e) => {
    this.setState({ progress: -1 });
    if (e.target.response && e.target.response.blob) {
      this.props.sendMessage({
        message: 'chat.attachment',
        type: 'chat.attachment',
        blob: e.target.response.blob
      }, this.props.chatData);
    }
  };

  handleTransferFailed = (e) => {
    this.setState({ progress: -1 });
  };

  handleUpdateProgress = (e) => {
    if (e.lengthComputable) {
      const percentComplete = e.loaded / e.total * 100;
      this.setState({ progress: percentComplete });
    } else {
      this.setState({ progress: -1 });
    }
  };

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

    let messageFormHeightAndFooter = 137;
    if(this.isChat(true)) {
      messageFormHeightAndFooter = 47 + this.state.formHeight;
    }

    const innerContentMaxHeight = iframeHeight - (this.isChat() ? messageFormHeightAndFooter : HEADER_FOOTER_HEIGHT);
    const fullHeight = this.scrollArea.current && this.scrollArea.current.content.scrollHeight <= innerContentMaxHeight;
    const height = innerContentMaxHeight >= contentHeight ? iframeHeight - (this.isChat() ? messageFormHeightAndFooter : HEADER_HEIGHT) : contentHeight + ((mobile && formFocused) || this.isChat() ? 0 : FOOTER_HEIGHT);

    const { chatData } = this.props;

    const { progress } = this.state;

    return (
      <Dropzone
        onDrop={this.handleDrop}
        noClick={true}
        noKeyboard={true}
        disabled={!this.isChat() || this.isChatEnded()}
      >
        {({getRootProps, getInputProps, isDragActive}) => (
          <div
            className={classNames(
              'dpmsg-ScreenContent',
              {'dpmsg-isChatScreenContent': this.isChat(), 'dpmsg-isChatEnded': this.isChatEnded()}
            )}
           {...getRootProps()}
          >
            <DropArea
              isDragActive={isDragActive}
              progress={progress}
              {...getInputProps()}
            />

            <ScrollArea
              horizontal={false}
              ref={this.scrollArea}
              className={classNames({ fullHeight })}
              style={{ height: this.isChat(true) ? `calc(100% - ${messageFormHeightAndFooter}px)` : undefined}}
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
                    handleFileSend={this.handleFileSend}
                    scrollMessages={(wrapperHeight) => {
                      if(!!chatData) {
                        this.setState({formHeight: wrapperHeight});
                        this.scrollToBottom();
                      }
                    }}
                  />
                )}
                <Footer />
              </Fragment>
            }
          </div>
        )}
      </Dropzone>
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
  withRouter,
  withVisitorId,
  withConfig
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
