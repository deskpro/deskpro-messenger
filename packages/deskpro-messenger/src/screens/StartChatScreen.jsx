import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
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
      name: user.name,
      email: user.email,
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
      this.createChat({ chat_department: department, name: user.name, email: user.email }, { message: messageModel });
    }
  };

  render() {
    const { department, departments, preChatForm, intl, user, uploadTo, formMessageEnabled, formMessage } = this.props;
    const { viewMode } = this.state;
    const dept = department ? departments[department] : {};
    const initialValues = { ...user };
    const correctedForm = preChatForm;
    if(correctedForm.length > 0) {
      correctedForm[0].fields.forEach(f => {
        if(f.field_id === 'name' && user.name) {
          f.field_type = 'hidden';
        }
        if(f.field_id === 'email' && user.email) {
          f.field_type = 'hidden';
        }
      });
    }
    const immutableLayout = fromJSGreedy(correctedForm);

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
            formMessageEnabled && <div key="form_message" className="dpmsg-StartChatScreen-FormMessage">
              { formMessage }
          </div>,
            <TicketForm
              key="ticket_form"
              initialValues={initialValues}
              deskproLayout={immutableLayout}
              departmentPropName="chat_department"
              departments={fromJSGreedy(departments)}
              department={department}
              fileUploadUrl={uploadTo}
              csrfToken="not_used"
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
  user:        getUser(state),
  departments: getChatDepartments(state, props)
});

export default compose(
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  ),
  injectIntl
)(StartChatScreen);
