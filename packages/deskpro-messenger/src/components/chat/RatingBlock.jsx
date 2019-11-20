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

export class RatingBlock extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    agent: PropTypes.object,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string
    })
  };

  state = { rating: null };

  handleClick = (e) => {
    const { name: rating } = e.target;
    this.setState({ rating }, () => {
      this.props.onSend({
        type: 'chat.rating',
        origin: 'user',
        rate: 0 + (rating === 'helpful')
      });
    });
  };

  render() {
    const { rating } = this.state;

    return !!rating ? this.renderSmile() : this.renderButtons();
  }

  renderButtons() {
    const { intl, agent } = this.props;
    return (
      <ChatPrompt
        header={intl.formatMessage(transMessages.questionHeader, agent)}
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
    const { intl, agent } = this.props;
    const { rating } = this.state;
    return (
      <ChatPrompt
        header={intl.formatMessage(transMessages.thankYouHeader, agent)}
      >
        <div className="dpmsg-PromptContentEvaluation">
          <i
            className={classNames(
              {
                'dpmsg-IconSmile': rating === 'helpful',
                'dpmsg-IconSadSmile': rating === 'unhelpful'
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
