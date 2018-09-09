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
            <button type="button" className="dpmsg-iconOnly">
              <i className="dpmsg-IconSmile" />
            </button>
            <button type="button" className="dpmsg-iconOnly">
              <i className="dpmsg-IconAttach" />
            </button>
          </div>
          <div className="dpmsg-LevelRight">
            <button className="dpmsg-iconOnly" onClick={this.handleSubmit}>
              <i className="dpmsg-IconSend" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageForm;
