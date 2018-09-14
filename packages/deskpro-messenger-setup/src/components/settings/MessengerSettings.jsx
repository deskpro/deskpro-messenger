import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Drawer, Heading, Input, Label, Toggle } from '@deskpro/react-components';

class MessengerSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const { config } = this.props;
    return (
      <Drawer>
        <Heading>Messenger settings</Heading>
        <Toggle
          checked={config.get('automatically_open_on_page_load')}
        >
          Automatically open the messenger on page load
        </Toggle>
        <br />
        <Label>Greeting</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'greeting'])}
        />
        <Label>Greeting subject</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'greeting_subject'])}
        />
        <h4>Chat</h4>
        <Label>Title</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'chat', 'title'])}
        />
        <Label>Description</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'chat', 'description'])}
        />
        <Label>Button text</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'chat', 'button_text'])}
        />
        <Toggle>Show agent profiles photos</Toggle>
        <h4>Tickets</h4>
        <Label>Title</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'tickets', 'title'])}
        />
        <Label>Description</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'tickets', 'description'])}
        />
        <Label>Button text</Label>
        <Input
          type="text"
          value={config.getIn(['messenger', 'tickets', 'button_text'])}
        />
      </Drawer>
    );
  }
}
export default MessengerSettings;