import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from '../form/Button';
import ChatPrompt from '../ui/ChatPrompt';

class TranscriptBlock extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    message: PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string
    }).isRequired
  };

  state = { view_mode: this.props.message.origin === 'user' ? 'final' : 'ask' };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.view_mode !== 'final' &&
      nextProps.message.origin === 'user'
    ) {
      return { view_mode: 'final' };
    }
    return null;
  }

  handleYesNo = e => {
    e.preventDefault();
    if (e.target.name === 'yes') {
      this.setState({ view_mode: 'fields' });
    }
  };

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = e => {
    e.preventDefault();
    const { name, email } = this.state;
    if (name && email) {
      this.props.onSend({
        type: 'chat.block.transcript',
        origin: 'user',
        name,
        email
      });
    }
  };

  render() {
    const { view_mode } = this.state;
    const { origin } = this.props.message;

    return (
      <ChatPrompt
        header={
          origin === 'user'
            ? 'Your transcript is on it’s way to:'
            : 'Would you like an email transcript?'
        }
        icon="Notes"
      >
        {view_mode === 'ask' && this.renderYesNo()}
        {view_mode === 'fields' && this.renderFields()}
        {view_mode === 'final' && this.renderFinal()}
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
          Yes
        </button>
        <button
          className="dpmsg-PromptBtn is-disagree"
          name="no"
          onClick={this.handleYesNo}
        >
          No
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
          Send a message
        </Button>
      </div>
    );
  }

  renderFinal() {
    return <span className="dpmsg-PromptText">{this.props.message.email}</span>;
  }
}

export default TranscriptBlock;
