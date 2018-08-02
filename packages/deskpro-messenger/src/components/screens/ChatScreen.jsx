import React, { Fragment, PureComponent } from 'react';

class ChatScreen extends PureComponent {
  state = { messages: [], newMessageText: '' };

  handleMessageChange = e => this.setState({ newMessageText: e.target.value });

  handleSendMessage = e => {
    e.preventDefault();
    if (this.state.newMessageText) {
      this.setState({
        messages: this.state.messages.concat([this.state.newMessageText]),
        newMessageText: ''
      });
    }
  };

  render() {
    return (
      <Fragment>
        <h1>{this.props.category} chat</h1>
        {this.state.messages.map((message, idx) => <p key={idx}>{message}</p>)}
        <textarea
          rows={2}
          name="message"
          id="message"
          placeholder="Enter your message"
          value={this.state.newMessageText}
          onChange={this.handleMessageChange}
        />
        <button onClick={this.handleSendMessage}>Send</button>
      </Fragment>
    );
  }
}

export default ChatScreen;
