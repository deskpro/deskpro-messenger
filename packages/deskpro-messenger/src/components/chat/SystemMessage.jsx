import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

const SystemMessage = ({ date_created, message, origin }) => (
  <span
    className={classNames('dpmsg-BubbleNotification', {
      'is-joined': origin === 'system',
      'is-end': origin !== 'system'
    })}
  >
    {message} ({moment(date_created).format('hh:mm a')})
  </span>
);

SystemMessage.propTypes = {
  message: PropTypes.string.isRequired,
  origin: PropTypes.string.isRequired
};

export default SystemMessage;
