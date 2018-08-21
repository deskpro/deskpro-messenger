import React from 'react';
import PropTypes from 'prop-types';

const ChatPrompt = ({ header, icon, children }) => (
  <div className="dpmsg-MessagePrompt">
    <div className="dpmsg-PromptHeader">
      {!!icon && <i className={`dpmsg-Icon${icon}`} />}
      <span className="dpmsg-PromptHeaderText">{header}</span>
    </div>
    {children}
  </div>
);

ChatPrompt.propTypes = {
  header: PropTypes.any.isRequired,
  icon: PropTypes.string,
  children: PropTypes.any.isRequired
};

export default ChatPrompt;
