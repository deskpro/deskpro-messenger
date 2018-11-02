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

const createTrans = ({ message, ...data }, type) => {
  if (typeof message === 'object' && message.phrase_id) {
    return [{ id: message.phrase_id }, message];
  } else if (type in transMessages) {
    return [transMessages[type], data];
  }
  return [];
};

class Chat extends PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    onSendMessage: PropTypes.func.isRequired,
    typing: PropTypes.object,
    user: PropTypes.object,
    chat: PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    })
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
      chat,
      chatConfig
    } = this.props;

    return (
      <Fragment>
        {messages.map((message, index) => {
          const key = message.uuid || `${message.type}-${index}`;
          switch (message.type) {
            case 'chat.message':
              return <MessageBubble key={key} {...message} />;
            case 'chat.agentAssigned':
              return (
                <SystemMessage
                  key={key}
                  {...message}
                  message={intl.formatMessage(
                    ...createTrans(message, 'agentAssigned')
                  )}
                />
              );
            case 'chat.ended':
              return (
                <Fragment>
                  <SystemMessage
                    key={key}
                    {...message}
                    message={intl.formatMessage(
                      ...createTrans(message, 'chatEnded')
                    )}
                  />
                  <TranscriptBlock
                    key={`${key}-transcript`}
                    onSend={onSendMessage}
                    user={user}
                  />
                  <RatingBlock
                    key={`${key}-rating`}
                    onSend={onSendMessage}
                    user={user}
                  />
                </Fragment>
              );
            case 'chat.noAgents':
              return (
                <SystemMessage
                  key={key}
                  {...message}
                  message={intl.formatMessage(
                    ...createTrans(message, 'noAgentOnline')
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

            default: {
              if (
                message.origin === 'system' &&
                message.message &&
                message.message.phrase_id
              ) {
                return (
                  <SystemMessage
                    key={key}
                    {...message}
                    message={intl.formatMessage(...createTrans(message))}
                  />
                );
              }
              return null;
            }
          }
        })}
        {!!typing && <TypingMessage value={typing} />}
        {!!chat &&
          chat.status !== 'ended' && <MessageForm onSend={onSendMessage} />}
      </Fragment>
    );
  }
}

export default injectIntl(Chat);
