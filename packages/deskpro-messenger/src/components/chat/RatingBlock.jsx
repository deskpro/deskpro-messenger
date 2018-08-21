import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../form/Button';
import ChatPrompt from '../ui/ChatPrompt';

class RatingBlock extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    message: PropTypes.shape({
      type: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  };

  handleClick = e => {
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
    return (
      <ChatPrompt
        header={`Rate your conversation with ${this.props.message.name}`}
      >
        <div className="dpmsg-PromptContentEvaluation">
          <Button
            width="limited"
            color="success"
            name="helpful"
            onClick={this.handleClick}
          >
            Helpful
          </Button>
          <Button
            width="limited"
            color="danger"
            name="unhelpful"
            onClick={this.handleClick}
          >
            Unhelpful
          </Button>
        </div>
      </ChatPrompt>
    );
  }

  renderSmile() {
    const { rate } = this.props.message;
    return (
      <ChatPrompt header={`Thank you for your feedback`}>
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

export default RatingBlock;
