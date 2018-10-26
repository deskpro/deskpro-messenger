import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import Chat from '../components/chat/Chat';
import Block from '../components/core/Block';
import { withConfig } from '../components/core/ConfigContext';

import {
  sendMessage,
  getMessages,
  getTypingState,
  getChatData
} from '../modules/chat';
import { getUserData } from '../modules/guest';
import { getDepartments } from '../modules/info';

class ChatScreen extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        chatId: PropTypes.string.isRequired
      })
    }),
    chatData: PropTypes.shape({
      fromScreen: PropTypes.string.isRequired
    }).isRequired,
    chatConfig: PropTypes.shape({
      department: PropTypes.number.isRequired,
      noAnswerBehavior: PropTypes.oneOf(['save_ticket', 'new_ticket'])
    }).isRequired,
    departments: PropTypes.object.isRequired,
    messages: PropTypes.array,
    typing: PropTypes.object
  };

  static defaultProps = {
    messages: [],
    typing: null
  };

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
      this.props.sendMessage(messageModel);
    }
  };

  render() {
    const { departments, chatConfig, intl, user } = this.props;
    const department = chatConfig.department
      ? departments[chatConfig.department]
      : {};

    return (
      <Block
        title={intl.formatMessage(
          {
            id: `chat.header.title`,
            defaultMessage: '{department} conversation'
          },
          { department: department.title }
        )}
      >
        <Chat
          messages={this.props.messages}
          onSendMessage={this.handleSendMessage}
          typing={this.props.typing}
          user={user}
          chatConfig={chatConfig}
        />
      </Block>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: getUserData(state),
  chatData: getChatData(state, props),
  messages: getMessages(state, props),
  typing: getTypingState(state, props),
  departments: getDepartments(state, props)
});

const mapProps = (WrappedComponent) => (props) => {
  const chatConfig =
    props.chatData && props.chatData.fromScreen
      ? props.screens[props.chatData.fromScreen]
      : {};
  return <WrappedComponent {...props} chatConfig={chatConfig} />;
};

export default compose(
  injectIntl,
  withConfig,
  connect(
    mapStateToProps,
    { sendMessage }
  ),
  mapProps
)(ChatScreen);
