import React from 'react';
import { Link } from 'react-router-dom';

export default ({ screenName }) => {
  if (screenName === 'index') {
    return <span className="dpmsg-LevelLevel" />;
  }
  return (
    <Link to="/screens/index" className="dpmsg-BackBtn dpmsg-LevelLeft">
      <i className="dpmsg-IconArrow iconArrow--left" />
    </Link>
  );
};
