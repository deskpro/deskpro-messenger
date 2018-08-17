import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import MessageForm from './MessageForm';
import TypingMessage from './TypingMessage';

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
        {messages.map(message => {
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
        {!!typing && <TypingMessage value={typing} />}
        <MessageForm onSend={onSendMessage} />
      </Fragment>
    );
  }
}

export default Chat;
