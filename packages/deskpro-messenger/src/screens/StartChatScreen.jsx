import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

// import Chat from '../components/chat/Chat';
import ChatEnterForm from '../components/chat/ChatEnterForm';
import Block from '../components/core/Block';

import { createChat, sendMessage } from '../modules/chat';
import { getUserData } from '../modules/guest';
import PromptMessage from '../components/chat/PromptMessage';

class StartChatScreen extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    preChatForm: PropTypes.array,
    prompt: PropTypes.string
  };

  static defaultProps = {
    user: {},
    preChatForm: [],
    prompt: ''
  };

  state = { viewMode: this.props.preChatForm.length ? 'form' : 'prompt' };
  promptMessage = this.props.prompt
    ? this.props.intl.formatMessage({
        id: this.props.prompt,
        defaultMessage: this.props.prompt
      })
    : null;

  createChat = (values, meta = {}) => {
    const { createChat, screenName, history } = this.props;
    createChat(values, {
      prompt: this.promptMessage,
      fromScreen: screenName,
      history,
      ...meta
    });
  };

  onSendMessage = (message) => {
    if (message) {
      const { category } = this.props;

      const messageModel =
        typeof message === 'string'
          ? {
              message,
              origin: 'user',
              type: 'chat.message'
            }
          : message;
      this.createChat({ category }, { message: messageModel });
    }
  };

  render() {
    const { category, preChatForm, prompt, intl, user } = this.props;
    const { viewMode } = this.state;

    const capCategory = category[0].toUpperCase() + category.substring(1);

    return (
      <Block
        title={intl.formatMessage(
          {
            id: `chat.header.${category}_title`,
            defaultMessage: '{category} conversation'
          },
          { category: capCategory }
        )}
      >
        {viewMode === 'form' && (
          <ChatEnterForm
            user={user}
            category={category}
            onSubmit={this.createChat}
            formConfig={preChatForm}
          />
        )}
        {viewMode === 'prompt' &&
          prompt && (
            <PromptMessage
              prompt={this.promptMessage}
              onSendMessage={this.onSendMessage}
            />
          )}
      </Block>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: getUserData(state)
});

export default compose(
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  ),
  injectIntl
)(StartChatScreen);
