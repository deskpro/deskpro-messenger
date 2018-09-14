import React from 'react';
import PropTypes from "prop-types";
import Immutable from "immutable";
import { Drawer, Heading, Input, Label, Textarea, Toggle } from '@deskpro/react-components';

class ChatSettings extends React.PureComponent {
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
        <Heading>Chat settings</Heading>
        <Toggle
          checked={config.get('chat_enabled')}
        >
          Enable chat
        </Toggle>
        <br />
        Prompt the user to describe their problem before the chat starts:<br />
        <Input
          type="text"
          value={config.get('user_prompt')}
        />
        <h4>Who can use chat</h4>
        <h4>Pre-chat form</h4>
        <h4>Unanswered chat</h4>
        If no agents are online to accept a chat, or when the user has waited for <Input className="small" type="text" value="90"/> seconds<br />
        <Label>Busy message</Label>
        <Textarea
          name="busy_message"
          id=""
          cols="40"
          rows="10"
          value={config.get('busy_message')}
        />
        <br />

        Missed chat ticket properties<br />
        Department<br />
        Subject<br />
      </Drawer>
    );
  }
}
export default ChatSettings;