import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export default ({ screenName }) => {
  console.log(screenName);
  if (screenName === 'index') {
    return <span className="dpmsg-LevelLevel" />;
  }
  return (
    <Link to={`/screens/index`} className="dpmsg-BackBtn dpmsg-LevelLeft">
      <i className="dpmsg-IconArrow iconArrow--left" />{' '}
      <FormattedMessage id="app.buttons.back" defaultMessage="back" />
    </Link>
  );
};
