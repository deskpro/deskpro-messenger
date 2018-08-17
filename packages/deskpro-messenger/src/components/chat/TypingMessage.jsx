import React from 'react';
import PropTypes from 'prop-types';

const TypingMessage = ({ value }) => (
  <div className="dpmsg-MessageBubble">
    <div className="dpmsg-MessageBubbleRow is-outgoing">
      {!!value.avatar && (
        <div className="dpmsg-AvatarCol is-rounded">
          <img src={value.avatar} alt={value.name} />
        </div>
      )}
      <div className="dpmsg-BubbleCol is-center">
        <span className="dpmsg-BubbleItem is-typing">...</span>
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
