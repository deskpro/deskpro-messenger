import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Button from '../form/Button';
import ChatPrompt from '../ui/ChatPrompt';

const transMessages = {
  questionHeader: {
    id: 'chat.end_block.question_header',
    defaultMessage: 'End your chat?'
  },
  buttonYes: {
    id: 'chat.end_block.buttons.yes',
    defaultMessage: 'Yes'
  },
  buttonNo: {
    id: 'chat.end_block.buttons.no',
    defaultMessage: 'No'
  }
};

export class ChatEndBlock extends PureComponent {
  static propTypes = {
    onEnd: PropTypes.func.isRequired
  };

  state = { rating: null };

  handleEnd = (e) => {
    e.preventDefault() && e.stopPropagation();
    this.props.onEnd();
  };

  handleResume = (e) => {
    e.preventDefault() && e.stopPropagation();
    this.props.onResume();
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
            onClick={this.handleResume}
          >
            {intl.formatMessage(transMessages.buttonNo)}
          </Button>
        </div>
      </ChatPrompt>
    );
  }
}

export default injectIntl(ChatEndBlock);
