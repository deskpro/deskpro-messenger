import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import MessageForm from './MessageForm';
import TypingMessage from './TypingMessage';
import TranscriptBlock from './TranscriptBlock';
import RatingBlock from './RatingBlock';

class Chat extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    messages: PropTypes.array,
    onSendMessage: PropTypes.func.isRequired,
    typing: PropTypes.object
  };

  render() {
    const { typing, messages, onSendMessage } = this.props;
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
                  message={`${message.name} joined the conversation.`}
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

export default Chat;
