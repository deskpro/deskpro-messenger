import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Field from '../form/InputField';

class ChatEnterForm extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    createChat: PropTypes.func.isRequired,
    baseUrl: PropTypes.string.isRequired
  };

  state = { name: '', email: '' };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, email } = this.state;
    if (name && email) {
      this.props.createChat({ name, email });
      this.props.history.push(`${this.props.baseUrl}/new-message`);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Field
          id="name"
          name="name"
          value={this.state.name}
          onChange={this.handleInputChange}
          placeholder="John Doe"
        />
        <Field
          id="email"
          name="email"
          value={this.state.email}
          onChange={this.handleInputChange}
          placeholder="john.doe@company.com"
        />
        <button className="dpmsg-Button Button-FullWidth Button--primary Button--medium">
          Start Conversation
        </button>
      </form>
    );
  }
}

export default ChatEnterForm;
