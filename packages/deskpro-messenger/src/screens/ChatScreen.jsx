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
    typing: PropTypes.object,
    preChatForm: PropTypes.array,
    prompt: PropTypes.string
  };

  static defaultProps = {
    chatId: null,
    messages: [],
    typing: null,
    preChatForm: [],
    prompt: ''
  };

  componentDidMount() {
    const {
      chatId,
      category,
      preChatForm,
      createChat,
      match,
      location
    } = this.props;
    const isNotChildPage = match.path === location.pathname;
    if (!preChatForm.length && !chatId && isNotChildPage) {
      createChat({ category });
    }
  }

  handleSendMessage = (message) => {
    if (message) {
      const messageModel =
        typeof message === 'string'
          ? {
              message,
              origin: 'user',
              type: 'chat.message'
            }
          : message;
      this.props.sendMessage(messageModel, this.props.category);
    }
  };

  render() {
    const {
      category,
      preChatForm,
      prompt,
      chatId,
      match: { path: baseUrl }
    } = this.props;
    const capCategory = category[0].toUpperCase() + category.substring(1);

    let defaultPage = `${baseUrl}/live`;
    if (preChatForm.length) {
      defaultPage = `${baseUrl}/auth`;
    } else if (prompt) {
      defaultPage = `${baseUrl}/new-message`;
    }

    return (
      <Block title={`${capCategory} conversation`}>
        <Switch>
          <Route
            path={`${baseUrl}/live`}
            render={(props) => (
              <Chat
                baseUrl={baseUrl}
                messages={this.props.messages}
                category={this.props.category}
                onSendMessage={this.handleSendMessage}
                typing={this.props.typing}
                chatId={chatId}
                {...props}
              />
            )}
          />
          {preChatForm.length > 0 && (
            <Route
              path={`${baseUrl}/auth`}
              render={(props) => (
                <ChatEnterForm
                  baseUrl={baseUrl}
                  category={this.props.category}
                  createChat={this.props.createChat}
                  formConfig={preChatForm}
                  nextStep={!!prompt ? 'new-message' : 'live'}
                  {...props}
                />
              )}
            />
          )}
          {!!prompt && (
            <Route
              path={`${baseUrl}/new-message`}
              render={(props) => (
                <FirstMessage
                  baseUrl={baseUrl}
                  category={this.props.category}
                  sendMessage={this.handleSendMessage}
                  prompt={prompt}
                  {...props}
                />
              )}
            />
          )}
          <Redirect to={defaultPage} />
        </Switch>
      </Block>
    );
  }
}

const mapStateToProps = (state, props) => ({
  chatId: getChatId(state, props),
  messages: getMessages(state, props),
  typing: getTypingState(state, props)
});
export default withRouter(
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  )(ChatScreen)
);
