import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';

class MessageForm extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired
  };

  state = { message: '' };

  onChange = e => {
    this.setState({ message: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { message } = this.state;
    this.props.onSend(message);
    this.setState({ message: '' });
  };

  render() {
    return (
      <div className="dpmsg-WrapTextarea">
        <ContentEditable
          className="dpmsg-MainTextarea"
          onChange={this.onChange}
          html={this.state.message}
          tagName="span"
        />
        <div className="dpmsg-TextareaActions dpmsg-Level">
          <div className="dpmsg-LevelLeft">
            <a href="#">
              <img
                src="https://deskpro.github.io/messenger-style/img/docs/smile-icon.png"
                alt=""
              />
            </a>
            <a href="#">
              <img
                src="https://deskpro.github.io/messenger-style/img/docs/attach-icon.png"
                alt=""
              />
            </a>
          </div>
          <div className="dpmsg-LevelRight">
            <a href="#" onClick={this.handleSubmit}>
              <img
                src="https://deskpro.github.io/messenger-style/img/docs/send-icon.png"
                alt=""
              />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageForm;
