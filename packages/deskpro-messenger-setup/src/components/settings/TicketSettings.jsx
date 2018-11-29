import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Drawer, Heading, Input, Label, Select, Toggle } from '@deskpro/react-components';

class TicketSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  departments = [{ value: 3, label: 'Sales' }, { value: 4, label: 'Support' }];

  render() {
    const { config, handleChange } = this.props;
    return (
      <Drawer>
        <Heading>Ticket settings</Heading>
        <Toggle
          checked={config.getIn(['tickets', 'enabled'])}
          name="tickets.enabled"
          onChange={handleChange}
        >
          Enable new tickets
        </Toggle>
        <Label>Department</Label>
        <Select
          options={this.departments}
          value={config.getIn(['tickets', 'ticketDefaults', 'department'])}
          onChange={this.handleSelectChange}
          name="tickets.ticketDefaults.department"
        />
        <Label>Subject</Label>
        <Input
          type="text"
          value={config.getIn(['tickets', 'ticketDefaults', 'subject'])}
          placeholder="Missed chat from {name}"
          name="tickets.ticketDefaults.subject"
        />
      </Drawer>
    );
  }
}
export default TicketSettings;
