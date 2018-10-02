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
    onSaveTicket: PropTypes.func.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string
    })
  };

  static defaultProps = {
    user: { name: '', email: '' }
  };

  renderFormOrQuestion() {
    const { formConfig, intl, onSaveTicket, user } = this.props;

    if (user.email) {
      return (
        <Fragment>
          <Button
            width="limited"
            color="success"
            name="yes"
            onClick={() => onSaveTicket(user)}
          >
            {intl.formatMessage(transMessages.buttonYes)}
          </Button>
          <Button
            width="limited"
            color="danger"
            name="no"
            onClick={() => {
              console.warn('TODO: cancel ticket creation');
            }}
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
        <SaveTicketForm formConfig={formConfig} onSubmit={onSaveTicket} />
      </Fragment>
    );
  }

  render() {
    const { intl, origin } = this.props;

    return (
      <ChatPrompt header={intl.formatMessage(transMessages.header)}>
        <div className="dpmsg-GroupInputs">
          {origin === 'system' && this.renderFormOrQuestion()}
          {origin === 'user' && (
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
