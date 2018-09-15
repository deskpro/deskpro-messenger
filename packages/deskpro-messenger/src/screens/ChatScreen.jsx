import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Chat from '../components/chat/Chat';
import ChatEnterForm from '../components/chat/ChatEnterForm';
import Block from '../components/core/Block';

import {
  createChat,
  getChatId,
  sendMessage,
  getMessages,
  getTypingState
} from '../modules/chat';

class ChatScreen extends PureComponent {
  static propTypes = {
    chatId: PropTypes.string,
    messages: PropTypes.array,
    typing: PropTypes.object,
    preChatForm: PropTypes.array,
    prompt: PropTypes.string
  };

  static defaultProps = {
    chatId: null,
    messages: [],
    typing: null,
    preChatForm: [],
    prompt: ''
  };

  state = {
    viewMode: this.props.preChatForm.length ? 'form' : 'chat',
    messages: []
  };

  componentDidUpdate(prevProps) {
    const { chatId, sendMessage, category } = this.props;
    if (!prevProps.chatId && chatId) {
      this.state.messages.forEach((message) => sendMessage(message, category));
    }
  }

  handleSendMessage = (message) => {
    const { chatId, category } = this.props;

    if (message) {
      const messageModel =
        typeof message === 'string'
          ? {
              message,
              origin: 'user',
              type: 'chat.message'
            }
          : message;

      if (!chatId) {
        this.setState(({ messages }) => ({
          messages: messages.concat([messageModel])
        }));

        if (!this.props.preChatForm.length && !this.state.messages.length) {
          this.props.createChat({ category });
        }
      } else {
        this.props.sendMessage(messageModel, category);
      }
    }
  };

  submitPreChatForm = (formValues) => {
    this.props.createChat(formValues);
    this.setState({ viewMode: 'chat' });
  };

  render() {
    const { category, preChatForm, prompt, chatId } = this.props;
    const { viewMode } = this.state;

    const capCategory = category[0].toUpperCase() + category.substring(1);

    return (
      <Block title={`${capCategory} conversation`}>
        {viewMode === 'form' && (
          <ChatEnterForm
            category={category}
            onSubmit={this.submitPreChatForm}
            formConfig={preChatForm}
          />
        )}
        {viewMode === 'chat' && (
          <Chat
            messages={chatId ? this.props.messages : this.state.messages}
            category={this.props.category}
            onSendMessage={this.handleSendMessage}
            typing={this.props.typing}
            chatId={chatId}
            prompt={prompt}
          />
        )}
      </Block>
    );
  }
}

const mapStateToProps = (state, props) => ({
  chatId: getChatId(state, props),
  messages: getMessages(state, props),
  typing: getTypingState(state, props)
});
export default connect(
  mapStateToProps,
  { createChat, sendMessage }
)(ChatScreen);
