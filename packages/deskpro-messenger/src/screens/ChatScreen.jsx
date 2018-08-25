import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Chat from '../components/chat/Chat';
import ChatEnterForm from '../components/chat/ChatEnterForm';
import FirstMessage from '../components/chat/FirstMessage';
import Block from '../components/core/Block';

import {
  createChat,
  getChatId,
  sendMessage,
  getMessages,
  getTypingState
} from '../modules/chat';

class ChatScreen extends PureComponent {
  static propTypes = {
    chatId: PropTypes.string,
    messages: PropTypes.array,
    typing: PropTypes.object
  };

  handleSendMessage = message => {
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
    const category = this.props.category;
    const capCategory = category[0].toUpperCase() + category.substring(1);
    const baseUrl = this.props.match.path;

    return (
      <Block title={`${capCategory} conversation`}>
        <Switch>
          <Route
            path={`${baseUrl}/live`}
            render={props => (
              <Chat
                baseUrl={baseUrl}
                messages={this.props.messages}
                category={this.props.category}
                onSendMessage={this.handleSendMessage}
                typing={this.props.typing}
                {...props}
              />
            )}
          />
          <Route
            path={`${baseUrl}/auth`}
            render={props => (
              <ChatEnterForm
                baseUrl={baseUrl}
                category={this.props.category}
                createChat={this.props.createChat}
                {...props}
              />
            )}
          />
          <Route
            path={`${baseUrl}/new-message`}
            render={props => (
              <FirstMessage
                baseUrl={baseUrl}
                category={this.props.category}
                sendMessage={this.handleSendMessage}
                {...props}
              />
            )}
          />
          <Redirect
            to={this.props.chatId ? `${baseUrl}/chat` : `${baseUrl}/auth`}
          />
        </Switch>
      </Block>
    );
  }
}

const mapStateToProps = state => ({
  chatId: getChatId(state),
  messages: getMessages(state),
  typing: getTypingState(state)
});
export default withRouter(
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  )(ChatScreen)
);
