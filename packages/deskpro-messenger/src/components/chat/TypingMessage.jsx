import React from 'react';
import PropTypes from 'prop-types';
import TextAvatar from './TextAvatar';

const TypingMessage = ({ value }) => (
  <div className="dpmsg-MessageBubble">
    <div className="dpmsg-MessageBubbleRow is-incoming">
      {!!value.avatar ? (
        <div className="dpmsg-AvatarCol is-rounded">
          <img src={value.avatar} alt={value.name} />
        </div>
      ) : <TextAvatar name={value.name} />}
      <div className="dpmsg-BubbleCol is-center">
        <span className="dpmsg-BubbleItem is-typing"><span>.</span><span>.</span><span>.</span></span>
      </div>
    </div>
  </div>
);

TypingMessage.propTypes = {
  value: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string
  }).isRequired
};

export default TypingMessage;
