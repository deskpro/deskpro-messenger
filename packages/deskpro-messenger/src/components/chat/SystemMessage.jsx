import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SystemMessage = ({ message, origin }) => (
  <span
    class={classNames('dpmsg-BubbleNotification', {
      'is-joined': origin === 'system',
      'is-end': origin !== 'system'
    })}
  >
    {message}
  </span>
);

SystemMessage.propTypes = {
  message: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired
};

export default SystemMessage;
