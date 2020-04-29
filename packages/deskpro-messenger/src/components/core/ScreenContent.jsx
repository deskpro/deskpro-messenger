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
import { createChat, getChatData, sendMessage } from '../../modules/chat';
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
      progress: -1,
      error: null
    };
    this.scrollArea = createRef();
  }

  // this trick may be removed after https://github.com/souhe/reactScrollbar/pull/147 will be merged
  componentDidMount() {
    const updateFunction = () => {
      if(this.scrollArea.current) {
        const { lineHeightPx } = this.scrollArea.current;
        if(!isNaN(lineHeightPx) && lineHeightPx) {
          clearInterval(this.scrollAreaLineHeightUpdateInterval);
        } else {
          this.scrollArea.current.lineHeightPx = 10;
        }
      }
    };
    this.scrollAreaLineHeightUpdateInterval = setInterval(updateFunction, 100);
  }

  componentWillUnmount() {
    this.scrollAreaLineHeightUpdateInterval && clearInterval(this.scrollAreaLineHeightUpdateInterval);
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
    let url = `${this.context.helpdeskURL}/api/messenger/file/upload-file`;
    if(['image/jpeg', 'image/gif', 'image/png'].includes(file.type)) {
      url = `${this.context.helpdeskURL}/api/messenger/file/upload-image`
    }
    AJAXSubmit({
      url,
      files: [file],
      name: 'blob',
      token: this.props.csrfToken,
      transferComplete: this.handleTransferComplete,
      transferFailed: this.handleTransferFailed,
      updateProgress: this.handleUpdateProgress,
      transferCanceled: this.handleTransferFailed,
      requestHeaders: {
        'X-DESKPRO-VISITORID': this.props.visitorId
      },
    });
  };

  handleTransferComplete = (e) => {
    this.setState({ progress: -1 });
    const { chatData } = this.props;
    if (e.target.response && e.target.response.blob) {
      const messageModel = {
        message: 'chat.attachment',
        type: 'chat.attachment',
        blob: e.target.response.blob
      };
      if (!!chatData) {
        this.props.sendMessage(messageModel, this.props.chatData);
      } else {
        this.createChat('attachment', 'chat.attachment', messageModel)
      }
    }
  };

  handleTransferFailed = (e) => {
    this.setState({
      progress: -1,
      error: e
    });
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

  clearError = () => {
    this.setState({
      error: null
    });
  }

  isChat = (strict = false) => {
    return this.props.location.pathname.indexOf('active-chat') !== -1 || (!strict && this.isStartChat());
  };

  isStartChat = () => {
    return this.props.location.pathname.indexOf('startChat') !== -1;
  };

  isStartForm = () => {
    const { screens: { startChat: { preChatForm }}} = this.props;

    return preChatForm.length > 0 && preChatForm[0].fields.length > 0
  };

  isChatEnded = () => {
    const { chatData } = this.props;
    return this.isChat() && !!chatData && chatData.status === 'ended';
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

  createChat = (message, type = 'chat.message', useModel = undefined) => {
    if (message && (type === 'chat.message' || type === 'chat.attachment')) {
      const { createChat, user, screens: { startChat: { department }} } = this.props;

      const messageModel = useModel ? useModel : {
        origin: 'user',
        type: 'chat.message',
        ...(typeof message === 'string' ? { message } : message)
      };

      const postData = { fields: {} };
      for(const [key, value] of Object.entries({ chat_department: department, name: user.name, email: user.email })) {
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
        ...{ message: messageModel }
      });
    }
  };

  shouldShowForm() {
    return (this.isChat(true) && !this.isChatEnded()) || (this.isStartChat() && !this.isStartForm());
  }

  renderMessageForm() {
    const { chatData, frameContext } = this.props;

    return (<MessageForm
      frameContext={frameContext}
      onSend={!!chatData && chatData.status !== 'ended' ? this.handleSendMessage : this.createChat}
      handleFileSend={this.handleFileSend}
      scrollMessages={(wrapperHeight) => {
        if(!!chatData) {
          this.setState({formHeight: wrapperHeight});
          this.scrollToBottom();
        }
      }}
    />);
  }

  render() {
    const { chatData, children, iframeHeight, frameContext, forwardedRef, formFocused } = this.props;

    let messageFormHeightAndFooter = 130;
    if(this.shouldShowForm()) {
      messageFormHeightAndFooter = ((!!chatData && chatData.status !== 'ended') || this.isStartChat() ? this.state.formHeight : 0) + (formFocused ? 0 : FOOTER_HEIGHT);
    }

    const innerContentMaxHeight = iframeHeight - (this.shouldShowForm() ? messageFormHeightAndFooter + HEADER_HEIGHT : HEADER_HEIGHT + this.isStartForm() ? 3 * FOOTER_HEIGHT : FOOTER_HEIGHT);
    const fullHeight = this.scrollArea.current && this.scrollArea.current.content.scrollHeight < innerContentMaxHeight;


    const { progress, error } = this.state;

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
              error={error}
              clearError={this.clearError}
              {...getInputProps()}
            />

            <ScrollArea
              horizontal={false}
              ref={this.scrollArea}
              className={classNames({ fullHeight })}
              style={{ height: this.shouldShowForm() ? `calc(100% - ${messageFormHeightAndFooter}px)` : undefined}}
              contentStyle={{ height: fullHeight ? `100%` : undefined}}
              stopScrollPropagation={true}
              contentWindow={frameContext.window}
              ownerDocument={frameContext.document}
            >
              <div ref={forwardedRef} className="dpmsg-ScreenContentWrapper">
                <ReactResizeDetector handleHeight>
                  {(width, height) => (
                    <ScreenContentContext.Provider value={{
                      isStartChat: this.isStartChat(),
                      isStartForm: this.isStartForm(),
                      animating: this.props.animating,
                      width,
                      height,
                      fullHeight,
                      maxHeight: innerContentMaxHeight - (mobile ? 67 : 97),
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
              {this.shouldShowForm() && this.renderMessageForm()}
              {!(mobile && formFocused) && <Footer />}
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
