import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { endChatMessage } from '../../modules/chat'
import ChatPrompt from '../ui/ChatPrompt';
import Button from '../form/Button';
import PropTypes from 'prop-types';

const transMessages = {
  header: {
    id: 'helpcenter.messenger.chat_create_ticket_header',
    defaultMessage: 'Submit a ticket'
  },
  intro: {
    id: 'helpcenter.messenger.chat_create_ticket_intro',
    defaultMessage:
      'You can submit a ticket instead and one of our agents will reply to you via email as soon as possible.'
  },
  button: {
    id: 'helpcenter.messenger.chat_create_ticket_button',
    defaultMessage: 'Create Ticket'
  }
};

class CreateTicketBlock extends PureComponent {

  static propTypes = {
    chat: PropTypes.object.isRequired,
    endChatMessage: PropTypes.func.isRequired
  };

  endChat = () => {
    this.props.endChatMessage(this.props.chat);
  };

  render() {
    const { intl } = this.props;

    return <ChatPrompt
      className="dpmsg-PromptLeftAligned dpmsg-PromptReducedMargin"
      icon='Email'
      header={intl.formatMessage(transMessages.header)}>
      <div className="dpmsg-PromptText">
        <FormattedMessage {...transMessages.intro} />
        <Button onClick={this.endChat} to="/screens/newTicket" color="primary">
          <FormattedMessage {...transMessages.button} />
        </Button>
      </div>
    </ChatPrompt>;
  }
}

export default compose(
  connect(
    null,
    { endChatMessage }
  ),
  injectIntl
)(CreateTicketBlock);
