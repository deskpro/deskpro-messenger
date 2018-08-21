import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { toggleSound, isMuted } from '../modules/chat';

const MuteButton = ({ isMuted, toggleSound }) => (
  <a onClick={toggleSound}>
    <i className={classNames('dpmsg-IconMute', { 'is-active': !!isMuted })} />
  </a>
);

MuteButton.propTypes = {
  isMuted: PropTypes.bool.isRequired,
  toggleSound: PropTypes.func.isRequired
};

export default connect(
  state => ({ isMuted: isMuted(state) }),
  { toggleSound }
)(MuteButton);
