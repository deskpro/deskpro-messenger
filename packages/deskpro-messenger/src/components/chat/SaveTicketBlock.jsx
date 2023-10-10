import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import ChatPrompt from '../ui/ChatPrompt';
import SaveTicketForm from './SaveTicketForm';
import Button from '../form/Button';

const transMessages = {
  header: {
    id: 'helpcenter.messenger.chat_save_ticket_question',
    defaultMessage: 'Would you like an agent to contact you?'
  },
  intro: {
    id: 'helpcenter.messenger.chat_save_ticket_intro',
    defaultMessage:
      'Enter your name and your email address and one of our agents will get back to you as soon as possible.'
  },
  thanks: {
    id: 'helpcenter.messenger.chat_save_ticket_thanks',
    defaultMessage: 'An agent will get back to you as soon as possible'
  },
  buttonYes: {
    id: 'helpcenter.messenger.chat_save_ticket_button_yes',
    defaultMessage: 'Yes'
  },
  buttonNo: {
    id: 'helpcenter.messenger.chat_save_ticket_button_no',
    defaultMessage: 'No'
  }
};

class SaveTicketBlock extends PureComponent {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired
    }).isRequired,
    formConfig: PropTypes.array,
    onSend: PropTypes.func.isRequired,
    ticketSubmitCallback: PropTypes.func,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string
    }),
    ticketParams: PropTypes.shape({
      department: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      subject: PropTypes.string
    })
  };

  state = { viewMode: 'ask' };

  static defaultProps = {
    user: { name: '', email: '' }
  };

  handleSubmit = (values) => {
    const { ticketParams, intl, onSend, ticketSubmitCallback } = this.props;
    console.log('ticketSubmitCallback', ticketSubmitCallback);
    if (ticketSubmitCallback) {
      ticketSubmitCallback(values, ticketParams);
    }
    this.setState({ viewMode: 'thanks' }, () =>
      onSend({
        type: 'chat.ticket.save',
        origin: 'user',
        ...values,
        department_id: ticketParams.department,
        subject: ticketParams.subject
          ? intl.formatMessage(
              {
                id: ticketParams.subject,
                defaultMessage: ticketParams.subject
              },
              values
            )
          : ticketParams.subject
      })
    );
  };

  handleCancel = () => {
    const { endChat } = this.props;
    this.setState({ viewMode: 'cancel' }, () => {
      endChat();
    });
  };

  renderFormOrQuestion() {
    const { formConfig, user, ticketParams, uploadTo } = this.props;

    if (user.email) {
      return (
        <div className="dpmsg-PromptContentEvaluation">
          <Button
            width="limited"
            color="success"
            name="yes"
            onClick={() => this.handleSubmit(user)}
          >
            <FormattedMessage {...transMessages.buttonYes} />
          </Button>
          <Button
            width="limited"
            color="danger"
            name="no"
            onClick={this.handleCancel}
          >
            <FormattedMessage {...transMessages.buttonNo} />
          </Button>
        </div>
      );
    }

    return (
      <Fragment>
        <div className="dpmsg-PromptText">
          <FormattedMessage {...transMessages.intro} />
        </div>
        <div className="dpmsg-GroupInputs dpmsg-NoTopPadding">
          <SaveTicketForm
            uploadTo={uploadTo}
            department={ticketParams.department}
            formConfig={formConfig}
            onSubmit={this.handleSubmit}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    const { intl } = this.props;
    const { viewMode } = this.state;

    if (viewMode === 'cancel') {
      return null;
    }

    return (
      <ChatPrompt
        className="dpmsg-PromptLeftAligned dpmsg-PromptReducedMargin"
        header={intl.formatMessage(transMessages.header)}
        icon='Headset'
      >
        {viewMode === 'ask' && this.renderFormOrQuestion()}
        {viewMode === 'thanks' && (
          <div className="dpmsg-PromptText">
            <FormattedMessage {...transMessages.thanks} />
          </div>
        )}
      </ChatPrompt>
    );
  }
}

export default injectIntl(SaveTicketBlock);
