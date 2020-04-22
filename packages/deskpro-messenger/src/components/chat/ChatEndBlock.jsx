import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Button from '../form/Button';
import ChatPrompt from '../ui/ChatPrompt';

const transMessages = {
  questionHeader: {
    id: 'helpcenter.messenger.chat_end_block_question_header',
    defaultMessage: 'End your chat?'
  },
  buttonYes: {
    id: 'helpcenter.messenger.chat_end_block_buttons_yes',
    defaultMessage: 'Yes'
  },
  buttonNo: {
    id: 'helpcenter.messenger.chat_end_block_buttons_no',
    defaultMessage: 'No'
  }
};

export class ChatEndBlock extends PureComponent {
  static propTypes = {
    onEnd: PropTypes.func.isRequired,
    onCancelEnd: PropTypes.func.isRequired
  };

  state = { rating: null };

  handleEnd = (e) => {
    e.preventDefault() && e.stopPropagation();
    this.props.onEnd();
  };

  onCancelEnd = (e) => {
    e.preventDefault() && e.stopPropagation();
    this.props.onCancelEnd();
  };

  render() {
    const { intl } = this.props;
    return (
      <ChatPrompt
        header={intl.formatMessage(transMessages.questionHeader)}
      >
        <div className="dpmsg-PromptContentEvaluation">
          <Button
            width="limited"
            color="success"
            name="yes"
            onClick={this.handleEnd}
          >
            {intl.formatMessage(transMessages.buttonYes)}
          </Button>
          <Button
            width="limited"
            color="danger"
            name="no"
            onClick={this.onCancelEnd}
          >
            {intl.formatMessage(transMessages.buttonNo)}
          </Button>
        </div>
      </ChatPrompt>
    );
  }
}

export default injectIntl(ChatEndBlock);
