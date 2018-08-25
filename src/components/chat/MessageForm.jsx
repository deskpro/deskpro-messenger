import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';

class MessageForm extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired
  };

  state = { message: '' };

  onChange = (e) => {
    const { value } = e.target;
    if (value.includes('<br>')) {
      this.handleSubmit(e);
    } else {
      this.setState({ message: e.target.value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault && e.preventDefault();
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
            <i className="dpmsg-IconSmile" />
            <i className="dpmsg-IconAttach" />
          </div>
          <div className="dpmsg-LevelRight">
            <a href={null} onClick={this.handleSubmit}>
              <i className="dpmsg-IconSend" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageForm;
