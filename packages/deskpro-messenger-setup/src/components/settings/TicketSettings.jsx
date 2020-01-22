import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Radio, Group, Heading, Input, Label, ListElement, Section, Select, Toggle, Icon } from '@deskpro/react-components';
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

  handleRadioChange = (checked, value, name) => {
    this.props.handleChange(value, name)
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
        <Section hidden={!opened}>
          <Section className='dp-ms-section'>
            <Toggle
              checked={config.getIn(['tickets', 'enabled'])}
              name="tickets.enabled"
              onChange={handleChange}
            >
              Enable new tickets
            </Toggle>
            <Section hidden={!config.getIn(['tickets', 'enabled'])}>
              <Group
                label="Department"
                htmlFor="ms-tickets-default-department"
              >
                <Radio
                  checked={config.getIn(['tickets', 'departmentOption']) === 'choose'}
                  name="tickets.departmentOption"
                  onChange={this.handleRadioChange}
                  value="choose"
                >
                  Selected by the user in the ticket form
                </Radio>
                <Radio
                  checked={config.getIn(['tickets', 'departmentOption']) === 'hidden'}
                  name="tickets.departmentOption"
                  onChange={this.handleRadioChange}
                  value="hidden"
                >
                  Set Department (removes from the ticket form)
                </Radio>
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
                  id="ms-tickets-default-department"
                />
                {
                  config.getIn(['tickets', 'departmentOption']) === 'choose' &&
                  <span className="dp-ms-hint">
                    Will be used as default selected department for a user, who can change it
                  </span>
                }
              </Group>
              <Group
                label="Subject"
                htmlFor="ms-tickets-default-subject"
              >
                <Input
                  type="text"
                  value={config.getIn(['tickets', 'subject'])}
                  placeholder="Ticket from {name}"
                  onChange={handleChange}
                  name="tickets.subject"
                  id="ms-tickets-default-subject"
                />
              </Group>
            </Section>
          </Section>
        </Section>
      </ListElement>
    );
  }
}
export default TicketSettings;
