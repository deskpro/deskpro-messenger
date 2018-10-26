import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import MessageForm from './MessageForm';
import TypingMessage from './TypingMessage';
import TranscriptBlock from './TranscriptBlock';
import RatingBlock from './RatingBlock';
import SaveTicketBlock from './SaveTicketBlock';
import CreateTicketBlock from './CreateTicketBlock';

const transMessages = {
  agentAssigned: {
    id: 'chat.agent_assigned.message',
    defaultMessage: `{name} joined the conversation.`
  },
  noAgentOnline: {
    id: 'chat.no_agent_online',
    defaultMessage: 'Sorry, no one is online to accept your chat.'
  },
  chatEnded: {
    id: 'chat.ended',
    defaultMessage: 'Chat ended'
  }
};

class Chat extends PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    onSendMessage: PropTypes.func.isRequired,
    typing: PropTypes.object,
    user: PropTypes.object
  };

  saveTicket = (values) => {
    this.props.onSendMessage({
      type: 'chat.block.saveTicket',
      origin: 'user',
      ...values,
      messages: this.props.messages
        .filter((m) => m.origin === 'user' && m.type === 'chat.message')
        .map((m) => m.message)
    });
  };

  render() {
    const {
      typing,
      messages,
      onSendMessage,
      intl,
      user,
      chatConfig
    } = this.props;

    return (
      <Fragment>
        {messages.map((message, index) => {
          const key = `${message.type}-${index}`;
          switch (message.type) {
            case 'chat.message':
              return <MessageBubble key={key} {...message} />;
            case 'chat.agentAssigned':
              return (
                <SystemMessage
                  key={key}
                  {...message}
                  message={intl.formatMessage(
                    transMessages.agentAssigned,
                    message
                  )}
                />
              );
            case 'chat.ended':
              return (
                <SystemMessage
                  {...message}
                  message={intl.formatMessage(transMessages.chatEnded, message)}
                />
              );
            case 'chat.noAgents':
              return (
                <SystemMessage
                  key={key}
                  {...message}
                  message={intl.formatMessage(
                    transMessages.noAgentOnline,
                    message
                  )}
                />
              );
            case 'chat.block.saveTicket':
              return (
                <SaveTicketBlock
                  key={key}
                  {...message}
                  user={user}
                  formConfig={chatConfig.ticketFormConfig}
                  onSaveTicket={this.saveTicket}
                />
              );

            case 'chat.block.createTicket':
              return <CreateTicketBlock key={key} {...message} />;

            case 'chat.block.transcript':
              return (
                <TranscriptBlock
                  key={key}
                  onSend={onSendMessage}
                  message={message}
                />
              );
            case 'chat.block.rate':
              return (
                <RatingBlock
                  key={key}
                  onSend={onSendMessage}
                  message={message}
                />
              );
            default:
              return null;
          }
        })}
        {!!typing && <TypingMessage value={typing} />}
        <MessageForm onSend={onSendMessage} />
      </Fragment>
    );
  }
}

export default injectIntl(Chat);
