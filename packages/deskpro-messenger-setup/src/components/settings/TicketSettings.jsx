import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Heading, Input, Label, ListElement, Section, Select, Toggle, Icon } from '@deskpro/react-components';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

class TicketSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    ticketDepartments: PropTypes.object,
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  handleSelectChange = (option, name) => {
    const value = typeof option === 'object' ? option.value : option;
    this.props.handleChange(value, name);
  };

  render() {
    const {
      config,
      handleChange,
      ticketDepartments,
      opened,
      onClick
    } = this.props;
    const drawerProps = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className: 'dp-column-drawer'
    };
    return (
      <ListElement {...drawerProps}>
        <Heading onClick={onClick} className="dp-ms-section-header">
          Ticket settings
          &nbsp;
          <Icon
            key="icon"
            aria-hidden
            onClick={onClick}
            className="dp-column-drawer__arrow"
            name={opened ? faCaretUp : faCaretDown}
          />
        </Heading>
        <Section className='dp-ms-section' hidden={!opened}>
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
            name="tickets.department"
          />
          <Label>Subject</Label>
          <Input
            type="text"
            value={config.getIn(['tickets', 'subject'])}
            placeholder="Ticket from {name}"
            onChange={handleChange}
            name="tickets.subject"
          />
        </Section>
      </ListElement>
    );
  }
}
export default TicketSettings;
