import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MessageBubble = ({ avatar, origin, message, name }) => (
  <div
    className={classNames('dpmsg-MessageBubbleRow', {
      'is-incoming': origin !== 'user',
      'is-outgoing': origin === 'user'
    })}
  >
    {avatar && (
      <div
        className={classNames('dpmsg-AvatarCol', {
          'is-rounded': origin === 'user'
        })}
      >
        <img src={avatar} alt={name} />
      </div>
    )}
    <div className="dpmsg-BubbleCol">
      <div
        className="dpmsg-BubbleItem"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  </div>
);

MessageBubble.propTypes = {
  avatar: PropTypes.string,
  origin: PropTypes.oneOf(['user', 'agent', 'system']).isRequired,
  message: PropTypes.string.isRequired,
  name: PropTypes.string
};

export default MessageBubble;
