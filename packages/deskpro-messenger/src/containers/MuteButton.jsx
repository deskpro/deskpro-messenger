import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { toggleSound, isMuted } from '../modules/chat';

export const MuteButton = ({ isMuted, toggleSound }) => (
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <a
    onClick={toggleSound}
    className={classNames('dpmsg-LevelRight', {
      'is-disabled': !!isMuted
    })}
  >
    <i className="dpmsg-IconMute" />
  </a>
);

MuteButton.propTypes = {
  isMuted: PropTypes.bool.isRequired,
  toggleSound: PropTypes.func.isRequired
};

export default connect(
  (state) => ({ isMuted: isMuted(state) }),
  { toggleSound }
)(MuteButton);
