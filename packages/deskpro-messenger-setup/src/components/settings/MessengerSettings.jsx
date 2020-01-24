import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Group, Heading, Icon, Input, Label, ListElement, Section, Toggle, Subheading } from '@deskpro/react-components';

class MessengerSettings extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  ensureTimeoutIsPositive = (value, name) => {
    if (value < 0) {
      value = 0;
    }
    this.props.handleChange(value, name);
  };

  render() {
    const { config, handleChange, opened, onClick } = this.props;
    const drawerProps = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className: 'dp-column-drawer'
    };
    return (
      <ListElement {...drawerProps}>
        <Heading onClick={onClick} className="dp-ms-section-header">
          Proactive chat settings
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
              checked={config.getIn(['messenger', 'autoStart'])}
              name="messenger.autoStart"
              onChange={handleChange}
            >
              Automatically open the messenger on page load
            </Toggle>
            {
              config.getIn(['messenger', 'autoStart']) &&
              <Label>
                Delay proactive chat by
                <Input
                  className="small"
                  type="number"
                  min={0}
                  max={9999}
                  value={config.getIn(['messenger', 'autoStartTimeout'])}
                  onChange={this.ensureTimeoutIsPositive}
                  name="messenger.autoStartTimeout"
                  id="ms-messenger-autoStartTimeout"
                />
                seconds
              </Label>
            }
          </Section>

          <Subheading size={4}>Greeting options</Subheading>
          <Section className='dp-ms-section'>
            <Group
              label="Greeting title"
              htmlFor="ms-messenger-title"
            >
              <Input
                id="ms-messenger-title"
                type="text"
                value={config.getIn(['messenger', 'title'])}
                name="messenger.title"
                onChange={handleChange}
              />
            </Group>
            <Group
              label="Greeting subtext"
              htmlFor="ms-messenger-subtext"
            >
              <Input
                id="ms-messenger-subtext"
                type="text"
                value={config.getIn(['messenger', 'subtext'])}
                name="messenger.subtext"
                onChange={handleChange}
              />
            </Group>
          </Section>
          <Subheading size={4}>Chat options</Subheading>
          <Section className='dp-ms-section'>
            <Group
              label="Title"
              htmlFor="ms-messenger-chat-title"
            >
              <Input
                id="ms-messenger-chat-title"
                type="text"
                value={config.getIn(['messenger', 'chat', 'title'])}
                name="messenger.chat.title"
                onChange={handleChange}
              />
            </Group>
            <Group
              label="Description"
              htmlFor="ms-messenger-chat-description"
            >
              <Input
                id="ms-messenger-chat-description"
                type="text"
                value={config.getIn(['messenger', 'chat', 'description'])}
                name="messenger.chat.description"
                onChange={handleChange}
              />
            </Group>
            <Group
              label="Button text"
              htmlFor="ms-messenger-chat-button-text"
            >
              <Input
                id="ms-messenger-chat-button-text"
                type="text"
                value={config.getIn(['messenger', 'chat', 'buttonText'])}
                name="messenger.chat.buttonText"
                onChange={handleChange}
              />
            </Group>
            <Toggle
              name="messenger.chat.showAgentPhotos"
              checked={config.getIn(['messenger', 'chat', 'showAgentPhotos'])}
              onChange={handleChange}
            >
              Show agent profiles photos
            </Toggle>
            <Toggle
              name="messenger.chat.startWithInputField"
              checked={config.getIn(['messenger', 'chat', 'startWithInputField'])}
              onChange={handleChange}
            >
              Start conversation with an input field
            </Toggle>
          </Section>
          <Subheading size={4}>Tickets options</Subheading>
          <Section className='dp-ms-section'>
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
      </ListElement>
    );
  }
}
export default MessengerSettings;
