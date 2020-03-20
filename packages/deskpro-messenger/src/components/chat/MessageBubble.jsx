import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import asset from '../../utils/asset';

class MessageBubble extends React.Component {

  renderFile() {
    const { message, meta } = this.props;
    const newMessage = message.match(/<a href.*>(.*)<\/a>/);
    return (
      <div className={classNames("dpmsg-BubbleAttachment", {'dpmsg-SameSender': !this.isNotTheSameSender()})}>
        <div className="dpmsg-BubbleAttachmentContent">
          <a href={meta.downloadUrl} rel="noreferrer noopener" target='_blank'>
            {meta.isImage && <div className="dpmsg-BubbleAttachmentContentPreview"><img alt={newMessage[1]} src={`${meta.downloadUrl}?s=245`} /></div>}
            {newMessage[1]} ({meta.filesize})
          </a>
        </div>
      </div>
    );
  }

  renderMessage() {
    const { message } = this.props;
    return <div
      className={classNames("dpmsg-BubbleItem", {'dpmsg-SameSender': !this.isNotTheSameSender()})}
      dangerouslySetInnerHTML={{ __html: message }}
    />
  }

  isNotTheSameSender() {
    const { origin, prev, author } = this.props;

    return !(prev.origin && prev.origin === origin) || !(prev.origin === origin && prev.author === author);
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
          <div className="dpmsg-AvatarCol is-rounded">
            <img src={avatar || asset('img/docs/avatar-default.jpg')} alt={name} />
          </div>
        )}
        <div className="dpmsg-BubbleCol">
          {(meta && meta.type === 'file') ? this.renderFile() : this.renderMessage()}
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
