import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import Immutable from 'immutable';

import Block from '../components/core/Block';
import { TicketForm } from '@deskpro/portal-components';
import { saveTicket } from '../modules/tickets';
import { getTicketDepartments } from '../modules/info';

function fromJSGreedy(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
}

const mapStateToProps = (state, props) => ({
  departments: getTicketDepartments(state, props)
});

class TicketFormScreen extends PureComponent {
  static propTypes = {
    formConfig:  PropTypes.array.isRequired,
    saveTicket:  PropTypes.func.isRequired,
    departments: PropTypes.object.isRequired,
    intl:        PropTypes.object.isRequired
  };

  static defaultProps = {
    ticketDefaults: {}
  };

  state = { viewMode: 'form' };

  onSubmit = (values) =>
    this.setState({ viewMode: 'thanks' }, () => this.props.saveTicket(values));

  render() {
    const { intl, formConfig, departments, department } = this.props;
    const { viewMode } = this.state;
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
        {viewMode === 'form' && (
          <TicketForm
            onSubmit={this.onSubmit}
            deskproLayout={immutableLayout}
            departments={fromJSGreedy(departments)}
            department={useDepartment}
            fileUploadUrl="http://deskpro5.local/en/dpblob"
            csrfToken="123456"
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
  mapStateToProps,
  { saveTicket }
)(injectIntl(TicketFormScreen));
