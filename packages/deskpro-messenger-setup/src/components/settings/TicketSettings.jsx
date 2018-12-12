import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Drawer, Heading, Input, Label, Select, Toggle } from '@deskpro/react-components';

class TicketSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    ticketDepartments: PropTypes.object,
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const {
      config,
      handleChange,
      ticketDepartments,
    } = this.props;
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
          options={ticketDepartments.toArray().map(dep => (
            {
              value: dep.get('id'),
              label: dep.get('title')
            }
          ))}
          value={config.getIn(['tickets', 'department'])}
          onChange={this.handleSelectChange}
          name="tickets.ticketDefaults.department"
        />
        <Label>Subject</Label>
        <Input
          type="text"
          value={config.getIn(['tickets', 'subject'])}
          placeholder="Missed chat from {name}"
          onChange={handleChange}
          name="tickets.ticketDefaults.subject"
        />
      </Drawer>
    );
  }
}
export default TicketSettings;
