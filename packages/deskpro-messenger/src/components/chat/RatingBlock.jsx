import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from '../form/Button';

class RatingBlock extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    message: PropTypes.shape({
      type: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired
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
    const { rate, name } = this.props.message;

    return (
      <div className="dpmsg-MessagePrompt">
        <div className="dpmsg-PromptHeader">
          <span className="dpmsg-PromptHeaderText">
            Rate your conversation with {name}
          </span>
        </div>
        <div className="dpmsg-PromptContentEvaluation">
          <Button
            width="limited"
            color="success"
            name="helpful"
            onClick={typeof rate === 'undefined' ? this.handleClick : undefined}
            disabled={rate === false}
          >
            Helpful
          </Button>
          <Button
            width="limited"
            color="danger"
            name="unhelpful"
            onClick={typeof rate === 'undefined' ? this.handleClick : undefined}
            disabled={rate === true}
          >
            Unhelpful
          </Button>
        </div>
      </div>
    );
  }
}

export default RatingBlock;
