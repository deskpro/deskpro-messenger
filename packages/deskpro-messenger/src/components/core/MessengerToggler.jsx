import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Frame from './Frame';

/*const buttonStyle = {
  width: '150px',
  alignSelf: 'flex-end',
  border: '1px solid',
  borderRadius: '2px',
  padding: '5px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#ddd'
};*/

const iframeStyle = {
  position: 'fixed',
  right: '14px',
  bottom: '14px',
  width: '70px',
  height: '70px'
};

class WidgetToggler extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const opened = this.props.location.pathname.startsWith('/screens');

    return (
      <Frame style={iframeStyle}>
        <Link
          className={classNames(`dpmsg-TriggerBtn`, {
            'dpmsg-Icon dpmsg-IconClose': opened
            // 'widget-toggler--button__collapsed': !opened
          })}
          to={opened ? '/' : '/screens'}
        >
          {opened ? (
            <img
              src="https://deskpro.github.io/messenger-style/img/docs/close-icon.png"
              alt=""
            />
          ) : (
            <img
              src="https://deskpro.github.io/messenger-style/img/docs/avatar.png"
              alt=""
            />
          )}
        </Link>
      </Frame>
    );
  }
}

export default WidgetToggler;
