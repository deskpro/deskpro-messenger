import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import ChatPrompt from '../ui/ChatPrompt';
import Button from '../form/Button';

const transMessages = {
  header: {
    id: 'chat.create_ticket.header',
    defaultMessage: 'Submit a ticket'
  },
  intro: {
    id: 'chat.create_ticket.intro',
    defaultMessage:
      'You can submit a ticket instead and one of our agents will reply to you via email as soon as possible.'
  },
  button: {
    id: 'chat.create_ticket.button',
    defaultMessage: 'Create Ticket'
  }
};

const CreateTicketBlock = ({ intl }) => (
  <ChatPrompt header={intl.formatMessage(transMessages.header)}>
    <div className="dpmsg-PromptText">
      <FormattedMessage {...transMessages.intro} />
      <Button to="/screens/newTicket" color="primary">
        <FormattedMessage {...transMessages.button} />
      </Button>
    </div>
  </ChatPrompt>
);

export default injectIntl(CreateTicketBlock);
