import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import Button from '../form/Button';
import ChatPrompt from '../ui/ChatPrompt';

const transMessages = {
  questionHeader: {
    id: 'chat.transcript_block.question_header',
    defaultMessage: 'Would you like an email transcript?'
  },
  answerHeader: {
    id: 'chat.transcript_block.answer_header',
    defaultMessage: 'Your transcript is on it’s way to:'
  },
  yesButton: {
    id: 'chat.transcript_block.yes_button',
    defaultMessage: 'Yes'
  },
  noButton: {
    id: 'chat.transcript_block.no_button',
    defaultMessage: 'No'
  },
  sendButton: {
    id: 'chat.transcript_block.send_button',
    defaultMessage: 'Send Message'
  }
};

export class TranscriptBlock extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string
    })
  };

  state = { viewMode: 'ask' };

  handleYesNo = (e) => {
    e.preventDefault();
    if (e.target.name === 'yes') {
      const { user } = this.props;
      if (user && user.email) {
        this.setState({ viewMode: 'final' }, () => this.submit(user));
      } else {
        this.setState({ viewMode: 'fields' });
      }
    } else {
      this.setState({ viewMode: 'hidden' });
    }
  };

  handleInputChange = (e) => this.setState({ [e.target.name]: e.target.value });

  submit = ({ name, email }) => {
    this.props.onSend({
      type: 'chat.transcript',
      origin: 'user',
      name,
      email
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email } = this.state;
    if (name && email) {
      this.setState({ viewMode: 'final' }, () => this.submit(this.state));
    }
  };

  render() {
    const { viewMode } = this.state;
    const { formatMessage } = this.props.intl;

    if (viewMode === 'hidden') {
      return null;
    }

    return (
      <ChatPrompt
        header={formatMessage(
          transMessages[`${viewMode === 'final' ? 'answer' : 'question'}Header`]
        )}
        icon="Notes"
      >
        {viewMode === 'ask' && this.renderYesNo()}
        {viewMode === 'fields' && this.renderFields()}
        {viewMode === 'final' && this.renderFinal()}
      </ChatPrompt>
    );
  }

  renderYesNo() {
    return (
      <div className="dpmsg-PromptContentAgree">
        <button
          className="dpmsg-PromptBtn is-agdee"
          name="yes"
          onClick={this.handleYesNo}
        >
          <FormattedMessage {...transMessages.yesButton} />
        </button>
        <button
          className="dpmsg-PromptBtn is-disagree"
          name="no"
          onClick={this.handleYesNo}
        >
          <FormattedMessage {...transMessages.noButton} />
        </button>
      </div>
    );
  }

  renderFields() {
    return (
      <div className="dpmsg-GroupInputs">
        <input
          className="dpmsg-Input"
          placeholder="name"
          name="name"
          onChange={this.handleInputChange}
        />
        <input
          className="dpmsg-Input"
          placeholder="email"
          name="email"
          onChange={this.handleInputChange}
        />
        <Button width="full" size="medium" onClick={this.handleSubmit}>
          <FormattedMessage {...transMessages.sendButton} />
        </Button>
      </div>
    );
  }

  renderFinal() {
    return (
      <span className="dpmsg-PromptText">
        {this.state.email || this.props.user.email}
      </span>
    );
  }
}

export default injectIntl(TranscriptBlock);
