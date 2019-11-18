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
import { getChatDepartments } from '../modules/info';

class StartChatScreen extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    preChatForm: PropTypes.array,
    prompt: PropTypes.string,
    departments: PropTypes.object.isRequired
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
    const { createChat, screenName, user } = this.props;
    createChat(values, {
      fromScreen: screenName,
      ...user,
      ...meta
    });
  };

  onSendMessage = (message) => {
    if (message) {
      const { department, user } = this.props;

      const messageModel = {
        origin: 'user',
        type: 'chat.message',
        ...(typeof message === 'string' ? { message } : message)
      };
      this.createChat({ department, ...user }, { message: messageModel });
    }
  };

  render() {
    const { department, departments, preChatForm, intl, user } = this.props;
    const { viewMode } = this.state;
    const dept = department ? departments[department] : {};

    return (
      <Block
        title={intl.formatMessage(
          {
            id: `chat.header.title`,
            defaultMessage: '{department} conversation'
          },
          { department: dept.title }
        )}
      >
        {viewMode === 'form' && (
          <ChatEnterForm
            user={user}
            department={department}
            onSubmit={this.createChat}
            formConfig={preChatForm}
          />
        )}
        {viewMode === 'prompt' && (
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
  user: getUserData(state),
  departments: getChatDepartments(state, props)
});

export default compose(
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  ),
  injectIntl
)(StartChatScreen);
