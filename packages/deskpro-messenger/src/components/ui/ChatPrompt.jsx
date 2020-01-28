import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ChatPrompt = ({ className, header, icon, faIcon, children }) => (
  <div className={classNames('dpmsg-MessagePrompt', className)}>
    <div className="dpmsg-PromptHeader">
      {!!icon && <i className={`dpmsg-Icon dpmsg-Icon${icon}`} />}
      {!!faIcon && <i className={classNames(faIcon, 'dpmsg-PromptFAIcon')} />}
      <span className="dpmsg-PromptHeaderText">{header}</span>
    </div>
    {children}
  </div>
);

ChatPrompt.propTypes = {
  header: PropTypes.any.isRequired,
  icon: PropTypes.string,
  faIcon: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any.isRequired
};

export default ChatPrompt;
