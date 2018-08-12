import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Chat from '../chat/Chat';
import MessageBubble from '../chat/MessageBubble';
import SystemMessage from '../chat/SystemMessage';
import MessageForm from '../chat/MessageForm';

import {
  createChat,
  getChatId,
  sendMessage,
  getMessages
} from '../../modules/chat';

class ChatScreen extends PureComponent {
  static propTypes = {
    chatId: PropTypes.string,
    messages: PropTypes.array
  };

  handleSendMessage = message => {
    if (message) {
      const messageModel = {
        message,
        origin: 'user',
        type: 'chat.message',
        avatar: 'https://deskpro.github.io/messenger-style/img/docs/avatar.png',
        author: 'John Doe'
      };
      this.props.sendMessage(messageModel);
    }
  };

  componentDidMount() {
    !this.props.chatId && this.props.createChat();
  }

  render() {
    return (
      <Fragment>
        {/* <Chat
          category={this.props.category}
          baseUrl={this.props.location.pathname}
        /> */}

        <div className="dpmsg-BlockWrapper">
          <span className="dpmsg-BlockHeader">
            {this.props.category} conversations
          </span>
          {this.props.messages.map(message => {
            switch (message.type) {
              case 'chat.message':
                return <MessageBubble {...message} />;
              case 'chat.agentAssigned':
                return (
                  <SystemMessage
                    {...message}
                    message={`${message.name} joined the conversation.`}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
        <MessageForm onSend={this.handleSendMessage} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  chatId: getChatId(state),
  messages: getMessages(state)
});
export default connect(
  mapStateToProps,
  { createChat, sendMessage }
)(ChatScreen);
