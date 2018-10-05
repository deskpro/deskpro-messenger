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
  getMessages,
  getTypingState,
  getChatData,
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
    chatData: PropTypes.shape({
      fromScreen: PropTypes.string.isRequired
    }).isRequired,
    chatConfig: PropTypes.shape({
      category: PropTypes.string.isRequired,
      noAnswerBehavior: PropTypes.oneOf(['save_ticket', 'new_ticket'])
    }).isRequired,
    messages: PropTypes.array,
    typing: PropTypes.object,
    isUnanswered: PropTypes.bool
  };

  static defaultProps = {
    messages: [],
    typing: null,
    isUnanswered: false
  };

  componentDidUpdate(prevProps) {
    const {
      match,
      chatConfig: { category, noAnswerBehavior, ticketFormConfig },
      isUnanswered
    } = this.props;
    if (!prevProps.isUnanswered && isUnanswered) {
      switch (noAnswerBehavior) {
        case 'save_ticket':
          this.props.showSaveTicketForm({
            category,
            formConfig: ticketFormConfig,
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
      chatConfig: { category },
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
  chatData: getChatData(state, props),
  messages: getMessages(state, props),
  typing: getTypingState(state, props),
  isUnanswered: isUnanswered(state, props)
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
    { sendMessage, showSaveTicketForm, showCreateTicket }
  ),
  mapProps
)(ChatScreen);
