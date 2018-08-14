import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';

import Chat from '../chat/Chat';
import ChatEnterForm from '../chat/ChatEnterForm';

import {
  createChat,
  getChatId,
  sendMessage,
  getMessages
} from '../../modules/chat';

class ChatScreen extends PureComponent {
  static propTypes = {
    chatId: PropTypes.string,
    messages: PropTypes.array
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
    const baseUrl = this.props.match.path;
    console.log('baseUrl', baseUrl);
    return (
      <Switch>
        <Route
          path={`${baseUrl}/live`}
          render={props => (
            <Chat
              baseUrl={baseUrl}
              messages={this.props.messages}
              category={this.props.category}
              onSendMessage={this.handleSendMessage}
              {...props}
            />
          )}
        />
        <Route
          path={`${baseUrl}/step1`}
          render={props => (
            <ChatEnterForm
              baseUrl={baseUrl}
              createChat={this.props.createChat}
              {...props}
            />
          )}
        />
        <Route
          path={`${baseUrl}/step2`}
          render={props => (
            <div>
              Your message <Link to={`${baseUrl}/live`}>Start</Link>
            </div>
          )}
        />
        <Redirect to={`${baseUrl}/step1`} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  chatId: getChatId(state),
  messages: getMessages(state)
});
export default withRouter(
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  )(ChatScreen)
);
