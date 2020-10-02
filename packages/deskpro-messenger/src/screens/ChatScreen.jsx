import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { withScreenContentSize } from '../components/core/ScreenContent';
import Chat from '../components/chat/Chat';
import Block from '../components/core/Block';
import { withConfig } from '../components/core/ConfigContext';

import {
  chatOpened,
  endChatMessage,
  getChatAgent,
  getChatData,
  getMessages,
  getTypingState,
  isChatAssigned,
  sendMessage,
  toggleChatEndBlock
} from '../modules/chat';
import { getUserData } from '../modules/guest';
import { getChatDepartments } from '../modules/info';
import Header from '../components/ui/Header';

class ChatScreen extends PureComponent {
  static propTypes = {
    agent: PropTypes.object,
    user: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        chatId: PropTypes.string.isRequired
      })
    }),
    chatData: PropTypes.shape({
      fromScreen: PropTypes.string.isRequired
    }).isRequired,
    chatConfig: PropTypes.shape({
      department: PropTypes.number.isRequired,
      noAnswerBehavior: PropTypes.oneOf(['', 'save_ticket', 'create_ticket'])
    }).isRequired,
    departments: PropTypes.object.isRequired,
    messages: PropTypes.array,
    typing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    sendMessage: PropTypes.func.isRequired,
    endChatMessage: PropTypes.func.isRequired,
    chatOpened: PropTypes.func.isRequired,
    contentSize: PropTypes.shape({
      animating: PropTypes.bool,
      height: PropTypes.number,
      maxHeight: PropTypes.number,
      fullHeight: PropTypes.bool,
    }),
  };

  static defaultProps = {
    messages: [],
    typing: null
  };

  state = {
    endChatBlock: false
  };

  componentDidMount() {
    const {chatData, chatOpened } = this.props;
    if(chatData.id) {
      chatOpened(chatData);
    }
  }

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

  onCancelEndChat = () => {
    this.props.toggleChatEndBlock(false);
  };

  handleEndChat = () => {
    this.props.endChatMessage(this.props.chatData);
  };

  render() {
    const { widget, departments, chatConfig, chatData, intl, user, agent, messages, typing } = this.props;
    const { contentSize: { maxHeight }} = this.props;
    const department = chatConfig.department
      ? departments[chatConfig.department]
      : {};

    const chat = {
      ...chatData,
      assigned: this.props.chatAssigned // we can't check just agent is not null
    };

    return (
      <Fragment>
        <Header icon={widget.icon.download_url}/>
        <Block
          title={intl.formatMessage(
            {
              id: `helpcenter.messenger.chat_header_title`,
              defaultMessage: '{department} conversation'
            },
            { department: department.title }
          )}
          style={{minHeight: maxHeight}}
          className="Block--chat"
        >
          <Chat
            messages={messages}
            onSendMessage={this.handleSendMessage}
            onEndChat={this.handleEndChat}
            onCancelEndChat={this.onCancelEndChat}
            typing={typing}
            user={user}
            agent={agent}
            chat={chat}
            chatConfig={chatConfig}
          />
        </Block>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user:         getUserData(state),
  chatData:     getChatData(state),
  agent:        getChatAgent(state),
  messages:     getMessages(state),
  typing:       getTypingState(state),
  departments:  getChatDepartments(state),
  chatAssigned: isChatAssigned(state)
});

const mapProps = (WrappedComponent) => (props) => {
  const chatConfig =
    props.chatData && props.chatData.fromScreen
      ? props.screens[props.chatData.fromScreen]
      : {};
  return <WrappedComponent {...props} chatConfig={chatConfig} />;
};

export default compose(
  injectIntl,
  withConfig,
  withScreenContentSize,
  connect(
    mapStateToProps,
    { sendMessage, endChatMessage, chatOpened, toggleChatEndBlock }
  ),
  mapProps
)(ChatScreen);
