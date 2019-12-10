import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Immutable from 'immutable';

import Block from '../components/core/Block';
import { TicketForm } from '@deskpro/portal-components';
import { getTicketSavedState, getTicketSavingState, getErrors, saveTicket, newTicket } from '../modules/tickets';
import { getTicketDepartments } from '../modules/info';

function fromJSGreedy(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
}

const mapStateToProps = (state, props) => {
  return {
    departments:  getTicketDepartments(state, props),
    ticketSaved:  getTicketSavedState(state),
    ticketSaving: getTicketSavingState(state),
    errors:       getErrors(state)
  };
};

class TicketFormScreen extends React.Component {
  static propTypes = {
    formConfig:   PropTypes.array.isRequired,
    saveTicket:   PropTypes.func.isRequired,
    newTicket:    PropTypes.func.isRequired,
    departments:  PropTypes.object.isRequired,
    intl:         PropTypes.object.isRequired,
    ticketSaved:  PropTypes.bool,
    ticketSaving: PropTypes.bool
  };

  static defaultProps = {
    ticketSaved: false,
    ticketSaving: false,
  };

  onSubmit = (values) =>
    this.props.saveTicket(values);

  componentDidMount() {
    this.props.newTicket();
  }

  render() {
    const { intl, formConfig, departments, department, ticketSaved, ticketSaving, errors } = this.props;
    const immutableLayout = fromJSGreedy(formConfig);
    let useDepartment = department;
    const layout = immutableLayout.find(d => d.get('department') === department);
    if (!layout) {
      useDepartment = 0;
    }

    return (
      <Block
        title={intl.formatMessage({
          id: `ticket_form.header`,
          defaultMessage: 'New Ticket'
        })}
      >
        {ticketSaving && (
          <FormattedMessage
            id="tickets.form.saving"
            defaultMessage="We're saving your ticket. Please wait"
          />
        )}
        {!ticketSaved && (
          <TicketForm
            errors={errors}
            onSubmit={this.onSubmit}
            deskproLayout={immutableLayout}
            departments={fromJSGreedy(departments)}
            department={useDepartment}
            fileUploadUrl="http://deskpro5.local/en/dpblob"
            csrfToken="123456"
          />
        )}
        {ticketSaved && !ticketSaving && (
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
  mapStateToProps,
  { saveTicket, newTicket }
)(injectIntl(TicketFormScreen));
