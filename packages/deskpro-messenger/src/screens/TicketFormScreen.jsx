import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { fromJSGreedy } from '../utils/common';

import Block from '../components/core/Block';
import { TicketForm } from '@deskpro/portal-components';
import { getTicketSavedState, getTicketSavingState, getErrors, saveTicket, newTicket } from '../modules/tickets';
import { getTicketDepartments } from '../modules/info';
import { getUser } from '../modules/guest';


const mapStateToProps = (state, props) => {
  return {
    departments:  getTicketDepartments(state, props),
    ticketSaved:  getTicketSavedState(state),
    ticketSaving: getTicketSavingState(state),
    user:         getUser(state),
    errors:       getErrors(state)
  };
};

class TicketFormScreen extends React.Component {
  static propTypes = {
    formConfig:   PropTypes.array.isRequired,
    uploadTo:     PropTypes.string.isRequired,
    saveTicket:   PropTypes.func.isRequired,
    newTicket:    PropTypes.func.isRequired,
    departments:  PropTypes.object.isRequired,
    intl:         PropTypes.object.isRequired,
    user:         PropTypes.object,
    ticketSaved:  PropTypes.bool,
    ticketSaving: PropTypes.bool
  };

  static defaultProps = {
    ticketSaved: false,
    ticketSaving: false,
    user: {name: '', email: ''}
  };

  onSubmit = (values) =>
    this.props.saveTicket(values);

  componentDidMount() {
    this.props.newTicket();
  }

  render() {
    const { intl, formConfig, uploadTo, departments, department, ticketSaved, ticketSaving, errors, user } = this.props;
    const immutableLayout = fromJSGreedy(formConfig);

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
            initialValues={{ person: user }}
            deskproLayout={immutableLayout}
            departmentPropName="department"
            departments={fromJSGreedy(departments)}
            department={department}
            fileUploadUrl={uploadTo}
            csrfToken="not_used"
            onSubmit={this.onSubmit}
            errors={errors}
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
