import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

import Block from '../components/core/Block';
import TicketForm from '../components/tickets/TicketForm';
import { saveTicket } from '../modules/tickets';

class TicketFormScreen extends PureComponent {
  static propTypes = {
    formConfig: PropTypes.array.isRequired,
    saveTicket: PropTypes.func.isRequired,
    ticketDefaults: PropTypes.object,
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    ticketDefaults: {}
  };

  state = { viewMode: 'form' };

  onSubmit = (values) =>
    this.setState({ viewMode: 'thanks' }, () => this.props.saveTicket(values));

  render() {
    const { intl, formConfig, ticketDefaults } = this.props;
    const { viewMode } = this.state;

    return (
      <Block
        title={intl.formatMessage({
          id: `ticket_form.header`,
          defaultMessage: 'New Ticket'
        })}
      >
        {viewMode === 'form' && (
          <TicketForm
            initialValues={ticketDefaults}
            formConfig={formConfig}
            onSubmit={this.onSubmit}
          />
        )}
        {viewMode === 'thanks' && (
          <FormattedMessage
            id="tickets.form.thanks"
            defaultMessage="Thank you! We will answer you soon via email."
          />
        )}
      </Block>
    );
  }
}

export default connect(
  null,
  { saveTicket }
)(injectIntl(TicketFormScreen));
