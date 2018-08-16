import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import MessageForm from './MessageForm';

class Chat extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    messages: PropTypes.array,
    onSendMessage: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
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
        <MessageForm onSend={this.props.onSendMessage} />
      </Fragment>
    );
  }
}

export default Chat;
