import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { withFrameContext } from '../core/Frame';

import MessageForm from './MessageForm';
import { withConfig } from '../core/ConfigContext';
import BotBubble from './BotBubble';
import { compose } from 'redux';
import { withScreenContentSize } from '../core/ScreenContent';
import { connect } from 'react-redux';
import { isMessageFormFocused } from '../../modules/app';
import isMobile from 'is-mobile';

const mobile = isMobile();

class PromptMessage extends PureComponent {
  static propTypes = {
    prompt: PropTypes.string,
    onSendMessage: PropTypes.func.isRequired
  };

  handleEndChat = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      prompt
    } = this.props;

    return (
      !!prompt && <BotBubble message={prompt} />
    );
  }
}

export default compose(
  withConfig,
  withRouter,
  withFrameContext,
  withScreenContentSize,
  connect(
    (state) => ({ formFocused: isMessageFormFocused(state)})
  )
)(PromptMessage);

