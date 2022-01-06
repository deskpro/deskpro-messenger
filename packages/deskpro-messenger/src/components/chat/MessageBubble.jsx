import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextAvatar } from './TextAvatar';

class MessageBubble extends React.Component {

  element = createRef();

  componentDidUpdate(prevProps, prevState) {
    if(this.element && !this.props.date_received) {
      this.props.collectMessagesToAck(this.element, this);
    }
  }

  renderFile() {
    const { message, meta } = this.props;
    const newMessage = message.match(/<a href.*>(.*)<\/a>/);
    const messageToShow = message
      .replace("<a", '<a target="_blank" rel="noreferrer noopener"')
      .replace(/<div class="file-attachment".*<\/div>/, '')
      .replace(/<br\s*\/?>$/, '')
    ;
    return newMessage && newMessage.length > 0 ? (
        <div className={classNames("dpmsg-BubbleAttachment", {'dpmsg-SameSender': !this.isNotTheSameSender()})}>
          <span dangerouslySetInnerHTML={{ __html: messageToShow }} />
          <div className="dpmsg-BubbleAttachmentContent">
            <a href={meta.downloadUrl} rel="noreferrer noopener" target='_blank'>
              {meta.isImage && <div className="dpmsg-BubbleAttachmentContentPreview"><img alt={newMessage[1]} src={`${meta.downloadUrl}?s=245`} /></div>}
              {newMessage[1]} ({meta.filesize})
            </a>
          </div>
        </div>
    ) : null;
  }

  renderMessage() {
    const { message } = this.props;
    return <div
      className={classNames("dpmsg-BubbleItem", {'dpmsg-SameSender': !this.isNotTheSameSender()})}
      dangerouslySetInnerHTML={{ __html: message.replace("<a", '<a target="_blank" rel="noreferrer noopener"') }}
    />
  }

  isNotTheSameSender() {
    const { origin, prev, author } = this.props;

    return !(prev.origin && prev.origin === origin) || !(prev.origin === origin && prev.author === author);
  }

  render() {
    const { avatar, origin, name, meta, user } = this.props;

    return (
      <div
        ref={this.element}
        className={classNames('dpmsg-MessageBubbleRow', {
          'is-incoming': origin !== 'user',
          'is-outgoing': origin === 'user',
          'dpmsg-SameSender': !this.isNotTheSameSender()
        })}
      >
        {(origin !== 'system' && this.isNotTheSameSender()) && (
          <div className="dpmsg-AvatarCol is-rounded">
            {avatar ? <img src={avatar} alt={name} /> : <TextAvatar user={user} name={name} />}
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
