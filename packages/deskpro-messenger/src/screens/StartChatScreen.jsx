import React, { Fragment, lazy, PureComponent, Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
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
  prompt: {
    id: 'helpcenter.messenger.chat_prompt',
    defaultMessage: 'What can we help you with today?'
  },
  preChatFormMessage: {
    id: 'helpcenter.messenger.chat_pre_chat_form_form_message',
    defaultMessage: 'Welcome to Deskpro. Please fill out the details below so we can direct you to the right person as quickly as possible.'
  },
  blockHeader: {
    id: `helpcenter.messenger.chat_header_title`,
    defaultMessage: '{department} conversation'
  },
  name: {
    id: 'helpcenter.messenger.tickets_form_name',
    defaultMessage: 'Name',
  },
  email: {
    id: 'helpcenter.messenger.tickets_form_email',
    defaultMessage: 'Email',
  },
  department: {
    id: 'helpcenter.general.department',
    defaultMessage: 'Department',
  },
  message: {
    id: 'helpcenter.messenger.tickets_form_message',
    defaultMessage: 'Message',
  },
  product: {
    id: 'helpcenter.messenger.tickets_form_product',
    defaultMessage: 'Product',
  },
  priority: {
    id: 'helpcenter.messenger.tickets_form_priority',
    defaultMessage: 'Priority',
  },
  category: {
    id: 'helpcenter.general.category',
    defaultMessage: 'Category',
  },
  submit: {
    id: 'helpcenter.messenger.tickets_form_submit',
    defaultMessage: 'Submit',
  },
  addAttachment: {
    id: 'helpcenter.messenger.tickets_form_add_attachment',
    defaultMessage: 'Add attachment',
  },
  dragNDrop: {
    id: 'helpcenter.general.drag_and_drop',
    defaultMessage: 'Drag and drop',
  },
  or: {
    id: 'helpcenter.messenger.tickets_form_or',
    defaultMessage: 'or',
  },
  chooseAFile: {
    id: 'helpcenter.general.form_choose_file',
    defaultMessage: 'Choose a file',
  },
  chooseFiles: {
    id: 'helpcenter.general.form_choose_files',
    defaultMessage: 'Choose files',
  },
  select: {
    id: 'helpcenter.messenger.tickets_form_select',
    defaultMessage: 'Select',
  },
  back: {
    id: 'helpcenter.messenger.tickets_form_back',
    defaultMessage: 'Back',
  },
  required: {
    id: 'helpcenter.messenger.tickets_form_required',
    defaultMessage: 'Required',
  },
  loading: {
    id: 'helpcenter.messenger.loading',
    defaultMessage: 'Loading',
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
    ? this.props.intl.formatMessage(transMessages.prompt)
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
    const { widget, department, departments, preChatForm, intl, user, uploadTo, formMessageEnabled } = this.props;
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
        <Header icon={widget.icon.download_url}/>
        <Block
          className="Block--chat"
          title={intl.formatMessage(
            transMessages.blockHeader,
            { department: dept.title }
          )}
          style={{ minHeight: !isNaN(maxHeight) ? maxHeight : undefined }}
        >
          {viewMode === 'form' && correctedForm[0].fields.length !== hiddenCount && (
            [
              formMessageEnabled && <div key="form_message" className="dpmsg-StartChatScreen-FormMessage">
                { intl.formatMessage(transMessages.preChatFormMessage) }
            </div>,
              <Suspense
                key="ticket_form_suspense"
                fallback={
                  <div><FormattedMessage {...transMessages.loading} />...</div>
                }
              >
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
                    name:          intl.formatMessage(transMessages.name),
                    email:         intl.formatMessage(transMessages.email),
                    department:    intl.formatMessage(transMessages.department),
                    message:       intl.formatMessage(transMessages.message),
                    product:       intl.formatMessage(transMessages.product),
                    priority:      intl.formatMessage(transMessages.priority),
                    category:      intl.formatMessage(transMessages.category),
                    submit:        intl.formatMessage(transMessages.submit),
                    addAttachment: intl.formatMessage(transMessages.addAttachment),
                    dragNDrop:     intl.formatMessage(transMessages.dragNDrop),
                    or:            intl.formatMessage(transMessages.or),
                    chooseAFile:   intl.formatMessage(transMessages.chooseAFile),
                    chooseFiles:   intl.formatMessage(transMessages.chooseFiles),
                    select:        intl.formatMessage(transMessages.select),
                    back:          intl.formatMessage(transMessages.back),
                    required:      intl.formatMessage(transMessages.required),
                  }}
                />
              </Suspense>
            ]
          )}
          {(viewMode === 'prompt' || (viewMode === 'form' && correctedForm[0].fields.length === hiddenCount)) && (
            <PromptMessage
              prompt={intl.formatMessage(transMessages.prompt)}
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
