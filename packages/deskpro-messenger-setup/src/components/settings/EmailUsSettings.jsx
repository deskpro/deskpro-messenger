import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  Group,
  Heading,
  Icon,
  Input,
  ListElement,
  Radio,
  Section,
  Select,
  Subheading,
  Toggle
} from '@deskpro/react-components';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames";

class EmailUsSettings extends React.PureComponent {
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

  handleTicketsToggleChange = (value, name)  => {
    if(!value && this.props.config.getIn(['chat', 'noAnswerBehavior']) === 'create_ticket') {
      this.props.handleChange('save_ticket', 'chat.noAnswerBehavior');
    }
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
          Email Us settings
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
              onChange={this.handleTicketsToggleChange}
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
            <Subheading
              size={4}
              className={classNames({hidden: !config.getIn(['tickets', 'enabled'])})}
            >
              Tickets options
            </Subheading>
            <Section
              className='dp-ms-section'
              hidden={!config.getIn(['tickets', 'enabled'])}
            >
              <Group
                label="Title"
                htmlFor="ms-messenger-tickets-title"
              >
                <Input
                  id="ms-messenger-tickets-title"
                  type="text"
                  value={config.getIn(['messenger', 'tickets', 'title'])}
                  name="messenger.tickets.title"
                  onChange={handleChange}
                />
              </Group>
              <Group
                label="Description"
                htmlFor="ms-messenger-tickets-description"
              >
                <Input
                  id="ms-messenger-tickets-description"
                  type="text"
                  value={config.getIn(['messenger', 'tickets', 'description'])}
                  name="messenger.tickets.description"
                  onChange={handleChange}
                />
              </Group>
              <Group
                label="Button text"
                htmlFor="ms-messenger-tickets-button-text"
              >
                <Input
                  id="ms-messenger-tickets-button-text"
                  type="text"
                  value={config.getIn(['messenger', 'tickets', 'buttonText'])}
                  name="messenger.tickets.buttonText"
                  onChange={handleChange}
                />
              </Group>
            </Section>
          </Section>
        </Section>
      </ListElement>
    );
  }
}
export default EmailUsSettings;
