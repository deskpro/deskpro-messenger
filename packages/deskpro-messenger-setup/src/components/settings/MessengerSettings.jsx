import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Heading, Icon, Input, Label, ListElement, Section, Toggle } from '@deskpro/react-components';

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
        <Section className='dp-ms-section' hidden={!opened}>
          <Toggle
            checked={config.getIn(['messenger', 'autoStart'])}
            name="messenger.autoStart"
            onChange={handleChange}
          >
            Automatically open the messenger on page load
          </Toggle>
          <br />
          <span style={{ display: config.getIn(['messenger', 'autoStart']) ? 'block' : 'none' }}>
          Delay proactive chat by
          <Input
            className="small"
            type="number"
            min={0}
            max={9999}
            value={config.getIn(['messenger', 'autoStartTimeout'])}
            onChange={this.ensureTimeoutIsPositive}
            name="messenger.autoStartTimeout"
          />
          seconds
          <br />
          </span>
          <Label>Greeting</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'title'])}
            name="messenger.title"
            onChange={handleChange}
          />
          <Label>Greeting subtext</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'subtext'])}
            name="messenger.subtext"
            onChange={handleChange}
          />
          <h4>Chat</h4>
          <Label>Title</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'chat', 'title'])}
            name="messenger.chat.title"
            onChange={handleChange}
          />
          <Label>Description</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'chat', 'description'])}
            name="messenger.chat.description"
            onChange={handleChange}
          />
          <Label>Button text</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'chat', 'buttonText'])}
            name="messenger.chat.buttonText"
            onChange={handleChange}
          />
          <Toggle
            name="messenger.chat.showAgentPhotos"
            checked={config.getIn(['messenger', 'chat', 'showAgentPhotos'])}
            onChange={handleChange}
          >
            Show agent profiles photos
          </Toggle>
          <h4>Tickets</h4>
          <Label>Title</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'tickets', 'title'])}
            name="messenger.tickets.title"
            onChange={handleChange}
          />
          <Label>Description</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'tickets', 'description'])}
            name="messenger.tickets.description"
            onChange={handleChange}
          />
          <Label>Button text</Label>
          <Input
            type="text"
            value={config.getIn(['messenger', 'tickets', 'buttonText'])}
            name="messenger.tickets.buttonText"
            onChange={handleChange}
          />
        </Section>
      </ListElement>
    );
  }
}
export default MessengerSettings;
