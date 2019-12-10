import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Heading, Icon, Input, Label, ListElement, Section, Select, Textarea, Toggle } from '@deskpro/react-components';

class ChatSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    chatDepartments: PropTypes.object,
    ticketDepartments: PropTypes.object
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  noAnswerOptions = [
    { value: '', label: 'Just show busy message' },
    { value: 'save_ticket', label: 'Save missed chat as ticket' },
    { value: 'create_ticket', label: 'Direct the user to new ticket' }
  ];

  handleSelectChange = (option, name) => {
    const value = typeof option === 'object' ? option.value : option;
    this.props.handleChange(value, name);
  };

  ensureTimeoutIsPositive = (value, name) => {
    if (value < 0) {
      value = 0;
    }
    this.props.handleChange(value, name);
  };

  render() {
    const {
      config,
      handleChange,
      chatDepartments,
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
        <Heading onClick={onClick}>
          Chat settings
          &nbsp;
          <Icon
            key="icon"
            aria-hidden
            onClick={onClick}
            className="dp-column-drawer__arrow"
            name={opened ? faCaretUp : faCaretDown}
          />
        </Heading>
        <Section className='dp-column-drawer__body' hidden={!opened}>
          <Toggle
            checked={config.getIn(['chat', 'enabled'])}
            name="chat.enabled"
            onChange={handleChange}
          >
            Enable chat
          </Toggle>
          <br />
          Prompt the user to describe their problem before the chat starts:
          <br />
          <Input
            type="text"
            value={config.getIn(['chat', 'prompt'])}
            name="chat.prompt"
            onChange={handleChange}
          />
          <Label>Default chat department</Label>
          <Select
            options={chatDepartments.toArray().map(dep => (
              {
                value: dep.get('id'),
                label: dep.get('title')
              }
            ))}
            value={config.getIn(['chat', 'department'])}
            onChange={this.handleSelectChange}
            name="chat.department"
          />
          <h4>Who can use chat</h4>
          <h4>Pre-chat form</h4>
          <h4>Unanswered chat</h4>
          If no agents are online to accept a chat, or when the user has waited
          for{' '}
          <Input
            className="small"
            type="number"
            min={0}
            max={9999}
            value={config.getIn(['chat', 'timeout'])}
            onChange={this.ensureTimeoutIsPositive}
            name="chat.timeout"
          />{' '}
          seconds
          <br />
          <Select
            options={this.noAnswerOptions}
            value={config.getIn(['chat', 'noAnswerBehavior'], '')}
            onChange={this.handleSelectChange}
            name="chat.noAnswerBehavior"
          />
          <Label>Busy message</Label>
          <Textarea
            name="chat.busyMessage"
            id=""
            cols="40"
            rows="10"
            value={config.getIn(['chat', 'busyMessage'])}
            onChange={handleChange}
          />
          <br />
          <u>Missed chat ticket properties</u>
          <Label>Department</Label>
          <Select
            options={ticketDepartments.toArray().map(dep => (
              {
                value: dep.get('id'),
                label: dep.get('title')
              }
            ))}
            value={config.getIn(['chat', 'ticketDefaults', 'department'])}
            onChange={this.handleSelectChange}
            name="chat.ticketDefaults.department"
          />
          <Label>Subject</Label>
          <Input
            type="text"
            value={config.getIn(['chat', 'ticketDefaults', 'subject'])}
            placeholder="Missed chat from {name}"
            onChange={handleChange}
            name="chat.ticketDefaults.subject"
          />
        </Section>
      </ListElement>
    );
  }
}
export default ChatSettings;
