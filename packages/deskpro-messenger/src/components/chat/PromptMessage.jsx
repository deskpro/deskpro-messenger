import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { withFrameContext } from '../core/Frame';

import MessageForm from './MessageForm';
import { withConfig } from '../core/ConfigContext';
import BotBubble from './BotBubble';

class PromptMessage extends PureComponent {
  static propTypes = {
    prompt: PropTypes.string,
    onSendMessage: PropTypes.func.isRequired
  };

  handleEndChat = () => {
    this.props.history.goBack();
  };

  render() {
    const { prompt, onSendMessage, frameContext } = this.props;

    return (
      <Fragment>
        {!!prompt && <BotBubble message={prompt} />}
        <MessageForm onSend={onSendMessage} frameContext={frameContext}/>
      </Fragment>
    );
  }
}

export default withFrameContext(withRouter(withConfig(PromptMessage)));
