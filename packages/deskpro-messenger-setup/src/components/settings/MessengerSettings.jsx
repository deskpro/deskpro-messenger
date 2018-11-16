import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  Drawer,
  Heading,
  Input,
  Label,
  Toggle
} from '@deskpro/react-components';

class MessengerSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const { config, handleChange } = this.props;
    return (
      <Drawer>
        <Heading>Messenger settings</Heading>
        <Toggle
          checked={config.get('messenger.autoStart')}
          name="messenger.autoStart"
          onChange={handleChange}
        >
          Automatically open the messenger on page load
        </Toggle>
        <br />
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
      </Drawer>
    );
  }
}
export default MessengerSettings;
