import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import MessageBubble from './MessageBubble';
import MessageForm from './MessageForm';

class PromptMessage extends PureComponent {
  static propTypes = {
    prompt: PropTypes.string,
    onSendMessage: PropTypes.func.isRequired
  };

  handleEndChat = () => {
    this.props.history.goBack();
  };

  render() {
    const { prompt, onSendMessage } = this.props;

    return (
      <Fragment>
        {!!prompt && <MessageBubble origin="system" message={prompt} />}
        <MessageForm onSend={onSendMessage}/>
      </Fragment>
    );
  }
}

export default withRouter(PromptMessage);
