import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import Chat from '../components/chat/Chat';
import Block from '../components/core/Block';
import { withConfig } from '../components/core/ConfigContext';

import {
  sendMessage,
  endChatMessage,
  chatOpened,
  getMessages,
  getTypingState,
  getChatData,
  getChatAgent, isChatAssigned
} from '../modules/chat';
import { getUserData } from '../modules/guest';
import { getChatDepartments } from '../modules/info';

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
      noAnswerBehavior: PropTypes.oneOf(['', 'save_ticket', 'new_ticket'])
    }).isRequired,
    departments: PropTypes.object.isRequired,
    messages: PropTypes.array,
    typing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    sendMessage: PropTypes.func.isRequired,
    endChatMessage: PropTypes.func.isRequired,
    chatOpened: PropTypes.func.isRequired
  };

  static defaultProps = {
    messages: [],
    typing: null
  };

  state = {
    endChatBlock: false
  };

  componentDidMount() {
    if(this.props.chatData.id) {
      this.props.chatOpened();
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

  onEndClick = () => {
    this.setState({endChatBlock: true});
  };

  onCancelEndChat = () => {
    this.setState({ endChatBlock: false });
  };

  handleEndChat = () => {
    this.props.endChatMessage(this.props.chatData);
  };

  render() {
    const { departments, chatConfig, chatData, intl, user, agent } = this.props;
    const department = chatConfig.department
      ? departments[chatConfig.department]
      : {};

    const chat = {
      ...chatData,
      assigned: this.props.chatAssigned // we can't check just agent is not null
    };

    return (
      <Block
        title={intl.formatMessage(
          {
            id: `chat.header.title`,
            defaultMessage: '{department} conversation'
          },
          { department: department.title }
        )}
        className="Block--chat"
      >
        {chatData.status !== 'ended' && (<div className="dpmsg-endChatButton">
          <span onClick={this.onEndClick}>End chat</span>
        </div>)}
        <Chat
          messages={this.props.messages}
          onSendMessage={this.handleSendMessage}
          onEndChat={this.handleEndChat}
          onCancelEndChat={this.onCancelEndChat}
          endChatBlock={this.state.endChatBlock}
          typing={this.props.typing}
          user={user}
          agent={agent}
          chat={chat}
          chatConfig={chatConfig}
        />
      </Block>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user:         getUserData(state),
  chatData:     getChatData(state, props),
  agent:        getChatAgent(state, props),
  messages:     getMessages(state, props),
  typing:       getTypingState(state, props),
  departments:  getChatDepartments(state, props),
  chatAssigned: isChatAssigned(state, props)
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
  connect(
    mapStateToProps,
    { sendMessage, endChatMessage, chatOpened }
  ),
  mapProps
)(ChatScreen);
