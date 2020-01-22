import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import asset from '../../utils/asset';

class MessageBubble extends React.Component {

  renderImage() {
    const { message, meta } = this.props;
    const regexp = `<a href="${meta.downloadUrl}" target="_blank">$1$2</a>`;
    const newMessage = message.replace(/(<img.*?>)(<\/div>)/, regexp);
    return <div
      className="dpmsg-BubbleItem"
      dangerouslySetInnerHTML={{ __html: newMessage }}
    />
  }

  renderMessage() {
    const { message } = this.props;
    return <div
      className={classNames("dpmsg-BubbleItem", {'dpmsg-SameSender': !this.isNotTheSameSender()})}
      dangerouslySetInnerHTML={{ __html: message }}
    />
  }

  isNotTheSameSender() {
    const { origin, prev } = this.props;

    return !(prev.origin && prev.origin === origin);
  }

  render() {
    const { avatar, origin, name, meta } = this.props;

    return (
      <div
        className={classNames('dpmsg-MessageBubbleRow', {
          'is-incoming': origin !== 'user',
          'is-outgoing': origin === 'user',
          'dpmsg-SameSender': !this.isNotTheSameSender()
        })}
      >
        {(origin !== 'system' && this.isNotTheSameSender()) && (
          <div
            className={classNames('dpmsg-AvatarCol is-rounded', {
              'is-rounded': origin === 'user'
            })}
          >
            <img src={avatar || asset('img/docs/avatar-default.jpg')} alt={name} />
          </div>
        )}
        <div className="dpmsg-BubbleCol">
          {(meta && meta.type === 'file' && meta.isImage) ? this.renderImage() : this.renderMessage()}
        </div>
      </div>
    );
  }
}

MessageBubble.propTypes = {
  avatar: PropTypes.string,
  origin: PropTypes.oneOf(['user', 'agent', 'system']).isRequired,
  message: PropTypes.string.isRequired,
  author: PropTypes.number.isRequired,
  prev: PropTypes.object,
  name: PropTypes.string
};

MessageBubble.defaultProps = {
  prev: {}
};

export default MessageBubble;
