import React, { Fragment, PureComponent } from 'react';
import Chat from '../chat/Chat';
import MessageBubble from '../chat/MessageBubble';
import SystemMessage from '../chat/SystemMessage';
import MessageForm from '../chat/MessageForm';

class ChatScreen extends PureComponent {
  state = {
    messages: [
      {
        type: 'chat.message',
        origin: 'agent',
        message:
          'Our mission is to help businesses and organizations like yours provide their customers with better support across every communication channel.'
      },
      {
        type: 'chat.agentAssigned',
        origin: 'system',
        message: 'Nick Green joined the conversation (12.47pm)'
      },
      {
        type: 'chat.message',
        origin: 'agent',
        message: 'How can we help you today?',
        avatar: 'https://deskpro.github.io/messenger-style/img/dp-logo.svg',
        author: 'John Doe'
      }
    ]
  };

  handleSendMessage = message => {
    if (message) {
      this.setState({
        messages: this.state.messages.concat([
          {
            message,
            origin: 'user',
            type: 'chat.message',
            avatar:
              'https://deskpro.github.io/messenger-style/img/docs/avatar.png',
            author: 'Nick Green'
          }
        ])
      });
    }
  };

  render() {
    return (
      <Fragment>
        {/* <Chat
          category={this.props.category}
          baseUrl={this.props.location.pathname}
        /> */}

        <div className="dpmsg-BlockWrapper">
          <span class="dpmsg-BlockHeader">
            {this.props.category} conversations
          </span>
          {this.state.messages.map(message => {
            switch (message.type) {
              case 'chat.message':
                return <MessageBubble {...message} />;
              case 'chat.agentAssigned':
                return <SystemMessage {...message} />;
              default:
                return null;
            }
          })}
        </div>
        <MessageForm onSend={this.handleSendMessage} />
      </Fragment>
    );
  }
}

export default ChatScreen;
