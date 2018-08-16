import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import MessageBubble from './MessageBubble';
import MessageForm from './MessageForm';

class FirstMessage extends PureComponent {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    sendMessage: PropTypes.func.isRequired
  };

  handleSendMessage = message => {
    this.props.sendMessage(message);
    this.props.history.push(`${this.props.baseUrl}/live`);
  };

  render() {
    return (
      <Fragment>
        <MessageBubble
          origin="system"
          message="What can we help you with today?"
        />
        <MessageForm onSend={this.handleSendMessage} />
      </Fragment>
    );
  }
}

export default FirstMessage;
