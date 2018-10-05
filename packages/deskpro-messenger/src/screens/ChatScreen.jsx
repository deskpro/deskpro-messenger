import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import Chat from '../components/chat/Chat';
import Block from '../components/core/Block';

import {
  sendMessage,
  getMessages,
  getTypingState,
  getChatParams,
  isUnanswered,
  showSaveTicketForm,
  showCreateTicket
} from '../modules/chat';
import { getUserData } from '../modules/guest';

class ChatScreen extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        chatId: PropTypes.string.isRequired
      })
    }),
    chatParams: PropTypes.shape({
      category: PropTypes.string.isRequired
    }).isRequired,
    messages: PropTypes.array,
    typing: PropTypes.object,
    isUnanswered: PropTypes.bool,
    noAnswerBehavior: PropTypes.oneOf(['save_ticket', 'new_ticket'])
  };

  static defaultProps = {
    messages: [],
    typing: null,
    isUnanswered: false,
    noAnswerBehavior: null
  };

  componentDidUpdate(prevProps) {
    const { match, category, isUnanswered } = this.props;
    if (!prevProps.isUnanswered && isUnanswered) {
      switch (this.props.noAnswerBehavior) {
        case 'save_ticket':
          this.props.showSaveTicketForm({
            category,
            formConfig: this.props.ticketFormConfig,
            chatId: match.params.chatId
          });
          break;
        case 'new_ticket':
          this.props.showCreateTicket({
            category,
            chatId: match.params.chatId
          });
          break;
        default:
          break;
      }
    }
  }

  handleSendMessage = (message) => {
    if (message) {
      const messageModel =
        typeof message === 'string'
          ? {
              message,
              origin: 'user',
              type: 'chat.message'
            }
          : message;
      this.props.sendMessage(messageModel);
    }
  };

  render() {
    const {
      chatParams: { category },
      intl,
      user
    } = this.props;

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
        <Chat
          messages={this.props.messages}
          onSendMessage={this.handleSendMessage}
          typing={this.props.typing}
          user={user}
        />
      </Block>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: getUserData(state),
  chatParams: getChatParams(state, props),
  messages: getMessages(state, props),
  typing: getTypingState(state, props),
  isUnanswered: isUnanswered(state, props)
});

export default compose(
  connect(
    mapStateToProps,
    { sendMessage, showSaveTicketForm, showCreateTicket }
  ),
  injectIntl
)(ChatScreen);
