import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MessageBubble from './MessageBubble';
import MessageForm from './MessageForm';

class FirstMessage extends PureComponent {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    sendMessage: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  handleSendMessage = (message) => {
    this.props.sendMessage(message);
    this.props.history.push(`${this.props.baseUrl}/live`);
  };

  render() {
    const { intl, prompt } = this.props;
    return (
      <Fragment>
        <MessageBubble
          origin="system"
          message={intl.formatMessage({ id: prompt, defaultMessage: prompt })}
        />
        <MessageForm onSend={this.handleSendMessage} />
      </Fragment>
    );
  }
}

export default injectIntl(FirstMessage);
