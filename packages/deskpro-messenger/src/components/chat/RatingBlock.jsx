import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import Button from '../form/Button';
import ChatPrompt from '../ui/ChatPrompt';

const transMessages = {
  questionHeader: {
    id: 'chat.rating_block.question_header',
    defaultMessage: 'Rate your conversation with {name}'
  },
  buttonHelpful: {
    id: 'chat.rating_block.buttons.helpful',
    defaultMessage: 'Helpful'
  },
  buttonUnhelpful: {
    id: 'chat.rating_block.buttons.unhelpful',
    defaultMessage: 'Unhelpful'
  },
  thankYouHeader: {
    id: 'chat.rating_block.thank_you_header',
    defaultMessage: 'Thank you for your feedback'
  }
};

class RatingBlock extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    message: PropTypes.shape({
      type: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  };

  handleClick = (e) => {
    this.props.onSend({
      ...this.props.message,
      origin: 'user',
      rate: e.target.name === 'helpful'
    });
  };

  render() {
    const { rate } = this.props.message;

    return typeof rate === 'undefined'
      ? this.renderButtons()
      : this.renderSmile();
  }

  renderButtons() {
    const { intl, message } = this.props;
    return (
      <ChatPrompt
        header={intl.formatMessage(transMessages.questionHeader, message)}
      >
        <div className="dpmsg-PromptContentEvaluation">
          <Button
            width="limited"
            color="success"
            name="helpful"
            onClick={this.handleClick}
          >
            {intl.formatMessage(transMessages.buttonHelpful)}
          </Button>
          <Button
            width="limited"
            color="danger"
            name="unhelpful"
            onClick={this.handleClick}
          >
            {intl.formatMessage(transMessages.buttonUnhelpful)}
          </Button>
        </div>
      </ChatPrompt>
    );
  }

  renderSmile() {
    const { rate } = this.props.message;
    return (
      <ChatPrompt
        header={this.props.intl.formatMessage(transMessages.thankYouHeader)}
      >
        <div className="dpmsg-PromptContentEvaluation">
          <i
            className={classNames(
              {
                'dpmsg-IconSmile': rate,
                'dpmsg-Icon': !!rate
              },
              'is-blue'
            )}
          />
        </div>
      </ChatPrompt>
    );
  }
}

export default injectIntl(RatingBlock);
