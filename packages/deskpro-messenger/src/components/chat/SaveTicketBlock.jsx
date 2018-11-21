import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import ChatPrompt from '../ui/ChatPrompt';
import SaveTicketForm from './SaveTicketForm';
import Button from '../form/Button';

const transMessages = {
  header: {
    id: 'chat.save_ticket.question',
    defaultMessage: 'Do you want to save a new ticket?'
  },
  intro: {
    id: 'chat.save_ticket.intro',
    defaultMessage:
      'Save your name and email address and one of our agents will get back to you as soon as possible.'
  },
  thanks: {
    id: 'chat.save_ticket.thanks',
    defaultMessage: 'An agent will get back to you as soon as possible'
  },
  buttonYes: {
    id: 'chat.save_ticket.button_yes',
    defaultMessage: 'Yes'
  },
  buttonNo: {
    id: 'chat.save_ticket.button_no',
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
    const { ticketParams, intl, onSend } = this.props;
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

  handleCancel = () => this.setState({ viewMode: 'cancel' });

  renderFormOrQuestion() {
    const { formConfig, intl, user } = this.props;

    if (user.email) {
      return (
        <Fragment>
          <Button
            width="limited"
            color="success"
            name="yes"
            onClick={() => this.handleSubmit(user)}
          >
            {intl.formatMessage(transMessages.buttonYes)}
          </Button>
          <Button
            width="limited"
            color="danger"
            name="no"
            onClick={this.handleCancel}
          >
            {intl.formatMessage(transMessages.buttonNo)}
          </Button>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <p className="dpmsg-PromptText">
          <FormattedMessage {...transMessages.intro} />
        </p>
        <SaveTicketForm formConfig={formConfig} onSubmit={this.handleSubmit} />
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
      <ChatPrompt header={intl.formatMessage(transMessages.header)}>
        <div className="dpmsg-GroupInputs">
          {viewMode === 'ask' && this.renderFormOrQuestion()}
          {viewMode === 'thanks' && (
            <p className="dpmsg-PromptText">
              <FormattedMessage {...transMessages.thanks} />
            </p>
          )}
        </div>
      </ChatPrompt>
    );
  }
}

export default injectIntl(SaveTicketBlock);
