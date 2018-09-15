import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import MessageForm from './MessageForm';
import TypingMessage from './TypingMessage';
import TranscriptBlock from './TranscriptBlock';
import RatingBlock from './RatingBlock';

const transMessages = {
  agentAssigned: {
    id: 'chat.agent_assigned.message',
    defaultMessage: `{name} joined the conversation.`
  },
  noAgentOnline: {
    id: 'chat.no_agent_online',
    defaultMessage: 'Sorry, no one is online to accept your chat.'
  }
};

class Chat extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    messages: PropTypes.array,
    onSendMessage: PropTypes.func.isRequired,
    typing: PropTypes.object
  };

  render() {
    const { typing, messages, onSendMessage, intl, prompt } = this.props;

    return (
      <Fragment>
        {!!prompt && (
          <MessageBubble
            origin="system"
            message={intl.formatMessage({ id: prompt, defaultMessage: prompt })}
          />
        )}
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
