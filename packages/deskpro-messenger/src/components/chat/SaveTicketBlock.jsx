import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import ChatPrompt from '../ui/ChatPrompt';
import SaveTicketForm from './SaveTicketForm';

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
  }
};

class SaveTicketBlock extends PureComponent {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired
    }).isRequired,
    formConfig: PropTypes.array,
    onSaveTicket: PropTypes.func.isRequired
  };

  render() {
    const { intl, formConfig, onSaveTicket, origin } = this.props;

    return (
      <ChatPrompt header={intl.formatMessage(transMessages.header)}>
        <div className="dpmsg-GroupInputs">
          {origin === 'system' && (
            <Fragment>
              <p className="dpmsg-PromptText">
                <FormattedMessage {...transMessages.intro} />
              </p>
              <SaveTicketForm formConfig={formConfig} onSubmit={onSaveTicket} />
            </Fragment>
          )}
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
