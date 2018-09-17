import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Block from '../components/core/Block';
import TicketForm from '../components/tickets/TicketForm';
import { saveTicket } from '../modules/tickets';

class TicketFormScreen extends PureComponent {
  static propTypes = {
    formConfig: PropTypes.array.isRequired,
    saveTicket: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  render() {
    return (
      <Block
        title={this.props.intl.formatMessage({
          id: `ticket_form.header`,
          defaultMessage: 'New Ticket'
        })}
      >
        <TicketForm
          formConfig={this.props.formConfig}
          onSubmit={this.props.saveTicket}
        />
      </Block>
    );
  }
}

export default connect(
  null,
  { saveTicket }
)(injectIntl(TicketFormScreen));
