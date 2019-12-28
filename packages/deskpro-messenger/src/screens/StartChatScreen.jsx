import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

// import Chat from '../components/chat/Chat';
import Block from '../components/core/Block';
import { createChat, sendMessage } from '../modules/chat';
import { getUser,  } from '../modules/guest';
import PromptMessage from '../components/chat/PromptMessage';
import { getChatDepartments } from '../modules/info';
import { fromJSGreedy } from '../utils/common';
import { TicketForm } from '@deskpro/portal-components';


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

  state = { viewMode: this.props.preChatForm.length > 0 ? 'form' : 'prompt' };
  promptMessage = this.props.prompt
    ? this.props.intl.formatMessage({
        id: this.props.prompt,
        defaultMessage: this.props.prompt
      })
    : null;

  createChat = (values, meta = {}) => {
    const { createChat, screenName, user } = this.props;
    const postData = { fields: {} };
    for(const [key, value] of Object.entries(values)) {
      if(key.match(/^chat_field/)) {
        postData.fields[key.split('_').splice(-1, 1).join('')] = value;
      } else {
        postData[key] = value;
      }
    }
    createChat(postData, {
      fromScreen: screenName,
      ...user,
      ...meta
    });
  };

  onSendMessage = (message, type = 'chat.message') => {
    if (message && type === 'chat.message') {
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
    const { department, departments, preChatForm, intl, user, uploadTo, brandMessageEnabled } = this.props;
    const immutableLayout = fromJSGreedy(preChatForm);
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
          [
            brandMessageEnabled && <div className="dpmsg-StartChatScreen-BrandMessage">
              Welcome to Deskpro. Please fill out the details below so we can direct you to the right person as quickly as possible.
          </div>,
            <TicketForm
              initialValues={{ person: user }}
              deskproLayout={immutableLayout}
              departments={fromJSGreedy(departments)}
              fileUploadUrl={uploadTo}
              csrfToken="not_used"
              departmentPropName="chat_department"
              department={department}
              onSubmit={this.createChat}
            />
          ]
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
  user: getUser(state),
  departments: getChatDepartments(state, props)
});

export default compose(
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  ),
  injectIntl
)(StartChatScreen);
