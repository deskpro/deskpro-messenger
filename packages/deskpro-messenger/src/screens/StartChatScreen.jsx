import React, { Fragment, lazy, PureComponent, Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import Block from '../components/core/Block';
import { createChat, sendMessage } from '../modules/chat';
import { withScreenContentSize } from '../components/core/ScreenContent';
import { getUser, } from '../modules/guest';
import PromptMessage from '../components/chat/PromptMessage';
import { getChatDepartments } from '../modules/info';
import { fromJSGreedy } from '../utils/common';
import Header from '../components/ui/Header';
import { getErrors } from '../modules/chat';
import { withConfig } from '../components/core/ConfigContext';

const TicketForm = lazy(() => import('../components/tickets/LazyTicketForm'));

const transMessages = {
  name: {
    id: 'tickets.form.name',
    defaultMessage: 'Name',
  },
  email: {
    id: 'tickets.form.email',
    defaultMessage: 'Email',
  },
  department: {
    id: 'tickets.form.department',
    defaultMessage: 'Department',
  },
  message: {
    id: 'tickets.form.message',
    defaultMessage: 'Message',
  },
  product: {
    id: 'tickets.form.product',
    defaultMessage: 'Product',
  },
  priority: {
    id: 'tickets.form.priority',
    defaultMessage: 'Priority',
  },
  category: {
    id: 'tickets.form.category',
    defaultMessage: 'Category',
  },
  submit: {
    id: 'tickets.form.submit',
    defaultMessage: 'Submit',
  },
  dragNDrop: {
    id: 'tickets.form.dragNDrop',
    defaultMessage: 'Drag and drop',
  },
  or: {
    id: 'tickets.form.or',
    defaultMessage: 'or',
  },
  chooseAFile: {
    id: 'tickets.form.chooseAFile',
    defaultMessage: 'Choose a file',
  },
  chooseFiles: {
    id: 'tickets.form.chooseFiles',
    defaultMessage: 'Choose files',
  },
  select: {
    id: 'tickets.form.select',
    defaultMessage: 'Select',
  },
  back: {
    id: 'tickets.form.back',
    defaultMessage: 'Back',
  },
  required: {
    id: 'tickets.form.required',
    defaultMessage: 'Required',
  },
};

class StartChatScreen extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    language: PropTypes.object,
    preChatForm: PropTypes.array,
    prompt: PropTypes.string,
    departments: PropTypes.object.isRequired
  };

  static defaultProps = {
    user: {},
    language: {},
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
    const { contentSize: { maxHeight }, errors } = this.props;
    const { viewMode } = this.state;
    const dept = department ? departments[department] : {};
    const initialValues = { ...user };
    const correctedForm = preChatForm;
    let hiddenCount = 0;
    if(correctedForm.length > 0) {
      correctedForm[0].fields.forEach(f => {
        if(f.field_id === 'name' && user.name) {
          f.field_type = 'hidden';
          hiddenCount++;
        }
        if(f.field_id === 'email' && user.email) {
          f.field_type = 'hidden';
          hiddenCount++
        }
        if(f.field_type === 'department' && f.is_hidden) {
          hiddenCount++
        }
      });
    }

    const immutableLayout = fromJSGreedy(correctedForm);

    return (
      <Fragment>
        <Header />
        <Block
          className="Block--chat"
          title={intl.formatMessage(
            {
              id: `chat.header.title`,
              defaultMessage: '{department} conversation'
            },
            { department: dept.title }
          )}
          style={{ minHeight: maxHeight}}
        >
          {viewMode === 'form' && correctedForm[0].fields.length !== hiddenCount && (
            [
              formMessageEnabled && <div key="form_message" className="dpmsg-StartChatScreen-FormMessage">
                { formMessage }
            </div>,
              <Suspense key="ticket_form_suspense" fallback={<div>Loading...</div>}>
                <TicketForm
                  key="ticket_form"
                  initialValues={initialValues}
                  deskproLayout={immutableLayout}
                  departmentPropName="chat_department"
                  departments={fromJSGreedy(departments)}
                  department={department}
                  fileUploadUrl={uploadTo}
                  errors={errors}
                  csrfToken="not_used"
                  onSubmit={this.createChat}
                  languageId={parseInt(this.props.language.id, 10)}
                  i18n={{
                    name:        intl.formatMessage(transMessages.name),
                    email:       intl.formatMessage(transMessages.email),
                    department:  intl.formatMessage(transMessages.department),
                    message:     intl.formatMessage(transMessages.message),
                    product:     intl.formatMessage(transMessages.product),
                    priority:    intl.formatMessage(transMessages.priority),
                    category:    intl.formatMessage(transMessages.category),
                    submit:      intl.formatMessage(transMessages.submit),
                    dragNDrop:   intl.formatMessage(transMessages.dragNDrop),
                    or:          intl.formatMessage(transMessages.or),
                    chooseAFile: intl.formatMessage(transMessages.chooseAFile),
                    chooseFiles: intl.formatMessage(transMessages.chooseFiles),
                    select:      intl.formatMessage(transMessages.select),
                    back:        intl.formatMessage(transMessages.back),
                    required:    intl.formatMessage(transMessages.required),
                  }}
                />
              </Suspense>
            ]
          )}
          {(viewMode === 'prompt' || (viewMode === 'form' && correctedForm[0].fields.length === hiddenCount)) && (
            <PromptMessage
              prompt={this.promptMessage}
              onSendMessage={this.onSendMessage}
            />
          )}
        </Block>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user:        getUser(state),
  departments: getChatDepartments(state, props),
  errors:      getErrors(state)
});

export default compose(
  withConfig,
  withScreenContentSize,
  connect(
    mapStateToProps,
    { createChat, sendMessage }
  ),
  injectIntl
)(StartChatScreen);
