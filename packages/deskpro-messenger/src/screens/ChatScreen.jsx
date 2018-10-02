import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import Chat from '../components/chat/Chat';
import ChatEnterForm from '../components/chat/ChatEnterForm';
import Block from '../components/core/Block';

import {
  createChat,
  getActiveChat,
  sendMessage,
  getMessages,
  getTypingState,
  isUnanswered,
  showSaveTicketForm,
  showCreateTicket
} from '../modules/chat';
import { getUserData } from '../modules/guest';

class ChatScreen extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    activeChat: PropTypes.string,
    messages: PropTypes.array,
    typing: PropTypes.object,
    preChatForm: PropTypes.array,
    prompt: PropTypes.string,
    isUnanswered: PropTypes.bool,
    noAnswerBehavior: PropTypes.oneOf(['save_ticket', 'new_ticket'])
  };

  static defaultProps = {
    activeChat: null,
    messages: [],
    typing: null,
    preChatForm: [],
    prompt: '',
    isUnanswered: false,
    noAnswerBehavior: null
  };

  state = {
    viewMode:
      !this.props.activeChat && this.props.preChatForm.length ? 'form' : 'chat',
    // we will save message drafts here until the chat is created.
    messages: []
  };

  componentDidUpdate(prevProps) {
    const { activeChat, sendMessage, category, isUnanswered } = this.props;
    if (!prevProps.activeChat && activeChat) {
      // send draft messages.
      this.state.messages.forEach((message) => sendMessage(message, category));
      this.setState({ messages: [] });
    } else if (prevProps.activeChat && !activeChat) {
      // reset the chat screen state when a chat is ended.
      this.setState({
        viewMode: this.props.preChatForm.length ? 'form' : 'chat'
      });
    }
    if (!prevProps.isUnanswered && isUnanswered) {
      switch (this.props.noAnswerBehavior) {
        case 'save_ticket':
          this.props.showSaveTicketForm({
            category,
            formConfig: this.props.ticketFormConfig,
            chatId: activeChat
          });
          break;
        case 'new_ticket':
          this.props.showCreateTicket({
            category,
            chatId: activeChat
          });
          break;
        default:
          break;
      }
    }
  }

  handleSendMessage = (message) => {
    const { activeChat, category } = this.props;

    if (message) {
      const messageModel =
        typeof message === 'string'
          ? {
              message,
              origin: 'user',
              type: 'chat.message'
            }
          : message;

      if (!activeChat) {
        this.setState(({ messages }) => ({
          messages: messages.concat([messageModel])
        }));

        if (!this.props.preChatForm.length && !this.state.messages.length) {
          this.props.createChat({ category });
        }
      } else {
        this.props.sendMessage(messageModel);
      }
    }
  };

  submitPreChatForm = (formValues) => {
    this.props.createChat(formValues);
    this.setState({ viewMode: 'chat' });
  };

  render() {
    const {
      category,
      preChatForm,
      prompt,
      activeChat,
      intl,
      user
    } = this.props;
    const { viewMode } = this.state;

    const capCategory = category[0].toUpperCase() + category.substring(1);

    return (
      <Block
        title={intl.formatMessage(
          {
            id: `chat.header.${category}_title`,
            defaultMessage: '{category} conversation'
          },
          { category: capCategory }
        )}
      >
        {viewMode === 'form' && (
          <ChatEnterForm
            user={user}
            category={category}
            onSubmit={this.submitPreChatForm}
            formConfig={preChatForm}
          />
        )}
        {viewMode === 'chat' && (
          <Chat
            messages={activeChat ? this.props.messages : this.state.messages}
            category={this.props.category}
            onSendMessage={this.handleSendMessage}
            typing={this.props.typing}
            chatId={activeChat}
            prompt={prompt}
            user={user}
          />
        )}
      </Block>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: getUserData(state),
  activeChat: getActiveChat(state, props),
  messages: getMessages(state, props),
  typing: getTypingState(state, props),
  isUnanswered: isUnanswered(state, props)
});

export default compose(
  connect(
    mapStateToProps,
    { createChat, sendMessage, showSaveTicketForm, showCreateTicket }
  ),
  injectIntl
)(ChatScreen);
