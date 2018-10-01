import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { getActiveChat } from '../modules/chat';

const BackButton = ({ screenName, hasActiveChat }) => {
  if (screenName === 'index' || hasActiveChat) {
    return <span className="dpmsg-LevelLevel" />;
  }
  return (
    <Link to={`/screens/index`} className="dpmsg-BackBtn dpmsg-LevelLeft">
      <i className="dpmsg-IconArrow iconArrow--left" />{' '}
      <FormattedMessage id="app.buttons.back" defaultMessage="back" />
    </Link>
  );
};

export default connect((state) => ({ hasActiveChat: !!getActiveChat(state) }))(
  BackButton
);
