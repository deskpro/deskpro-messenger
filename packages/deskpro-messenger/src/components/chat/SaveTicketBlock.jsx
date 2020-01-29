import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import ChatPrompt from '../ui/ChatPrompt';
import SaveTicketForm from './SaveTicketForm';
import Button from '../form/Button';

const transMessages = {
  header: {
    id: 'chat.save_ticket.question',
    defaultMessage: 'Would you like an agent to contact you?'
  },
  intro: {
    id: 'chat.save_ticket.intro',
    defaultMessage:
      'Enter your name and your email address and one of our agents will get back to you as soon as possible.'
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
    const { formConfig, intl, user, ticketParams, uploadTo } = this.props;

    if (user.email) {
      return (
        <div className="dpmsg-PromptContentEvaluation">
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
        className="dpmsg-PromptLeftAligned"
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
