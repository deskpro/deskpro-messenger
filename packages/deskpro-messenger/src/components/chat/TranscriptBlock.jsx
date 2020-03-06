import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import * as Yup from 'yup'

import Button from '../form/Button';
import ChatPrompt from '../ui/ChatPrompt';

const schema = Yup.object().shape({
  name:  Yup.string(),
  email: Yup.string().email()
});

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

  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = { viewMode: 'ask', ...user, errors: {} }
  }


  handleYes = (e) => {
    e.preventDefault();
    const { user } = this.props;
    if (user && user.email) {
      this.setState({ viewMode: 'final' }, () => this.submit(user, 1));
    } else {
      this.setState({ viewMode: 'fields' });
    }
  };

  handleNo = (e) => {
    e.preventDefault();
    this.setState({ viewMode: 'hidden' }, () => this.submit({}, 0));
  };

  handleInputChange = (e) => {
    let errors = {};
    const shape = {
      name:  this.state.name,
      email: this.state.email
    };
    shape[e.target.name] = e.target.value;
    try {
      schema.validateSync(shape);
    } catch (e) {
      errors = { [e.path]: e.errors };
    }
    this.setState({ ...shape, errors });
  };

  submit = ({ name, email }, transcript) => {
    this.props.onSend({
      type: 'chat.transcript',
      origin: 'user',
      transcript,
      name,
      email
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, errors} = this.state;
    if (name && email && !errors.email && !errors.name ) {
      this.setState({ viewMode: 'final' }, () => this.submit({name, email}, 1));
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
        className={'dpmsg-TranscriptBlock'}
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
          className="dpmsg-PromptBtn is-agree"
          name="yes"
          onClick={this.handleYes}
        >
          <FormattedMessage {...transMessages.yesButton} />
        </button>
        <button
          className="dpmsg-PromptBtn is-disagree"
          name="no"
          onClick={this.handleNo}
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
        {this.state.errors.email ? <span className="dpmsg-InputError">{ this.state.errors.email.join(', ')}</span> : null}
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
