import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Chat from '../chat/Chat';
import ChatEnterForm from '../chat/ChatEnterForm';
import FirstMessage from '../chat/FirstMessage';
import Block from '../core/Block';

import {
  createChat,
  getChatId,
  sendMessage,
  getMessages,
  getTypingState
} from '../../modules/chat';

class ChatScreen extends PureComponent {
  static propTypes = {
    chatId: PropTypes.string,
    messages: PropTypes.array,
    typing: PropTypes.bool
  };

  handleSendMessage = message => {
    if (message) {
      this.props.sendMessage({
        message,
        origin: 'user',
        type: 'chat.message'
      });
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
                sendMessage={this.handleSendMessage}
                {...props}
              />
            )}
          />
          <Redirect to={`${baseUrl}/auth`} />
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
